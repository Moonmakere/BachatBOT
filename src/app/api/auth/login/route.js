// pages/api/login.js
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import connectDB from "../../../../lib/mongoDb";
import User from "../../../../models/userModel";

export async function POST(req) {
  try {
    console.log("Inside the login route");

    await connectDB();
    const { email, password } = await req.json();

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 400 });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 400 }
      );
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email, firstName: user.firstName },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    console.log("TOKEN", token);

    const response = NextResponse.json(
      { token, message: "Successful" },
      { status: 200 }
    );

    response.cookies.set("token", token, {
      httpOnly: true,
      maxAge: 60 * 60, // 1 hour
    });

    response.headers.set("Authorization", `Bearer ${token}`);

    return response;
  } catch (error) {
    console.error("Error in login route:", error);
    return NextResponse.json({ error: "Error logging in" }, { status: 500 });
  }
}
