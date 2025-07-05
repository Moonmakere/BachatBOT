import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import connectDB from "../../../../lib/mongoDb";
import User from "../../../../models/userModel";

export async function POST(request) {
  await connectDB();

  try {
    const { email, verifyCode } = await request.json();

    const user = await User.findOne({
      email: { $regex: new RegExp(`^${email}$`, "i") },
      verifyCode: verifyCode,
      verifyCodeExpiry: { $gt: new Date() },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Invalid or expired verification code" },
        { status: 400 }
      );
    }

    // Mark user as verified
    user.isVerified = true;
    user.verifyCode = "";
    user.verifyCodeExpiry = new Date();
    await user.save();

    // Generate JWT
    const token = jwt.sign(
      { userId: user._id, email: user.email, firstName: user.firstName },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    console.log("TOKEN", token);

    // Prepare response
    const response = NextResponse.json(
      { token, message: "Successful" },
      { status: 200 }
    );

    // Set token as HttpOnly cookie
    response.cookies.set("token", token, {
      httpOnly: true,
      maxAge: 60 * 60, // 1 hour
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      path: "/",
    });

    // Optionally also send token in header (if needed by frontend)
    response.headers.set("Authorization", `Bearer ${token}`);

    return response;
  } catch (error) {
    console.error("Error verifying email:", error);
    return NextResponse.json(
      { error: "Error verifying email" },
      { status: 500 }
    );
  }
}
