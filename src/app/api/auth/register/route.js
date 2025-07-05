import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectDB from "../../../../lib/mongoDb";
import User from "../../../../models/userModel";
import { sendVerificationEmail } from "../../../../helpers/sendVerificationMails"; // optional email helper

// Generate a 6-digit numeric code
const generateVerifyCode = () => Math.floor(100000 + Math.random() * 900000).toString();

export async function POST(req) {
  try {
    await connectDB();
    const { firstName, lastName, email, password } = await req.json();

    const existingUser = await User.findOne({ email });

    const verifyCode = generateVerifyCode();
    const verifyCodeExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now

    if (existingUser) {
      if (existingUser.isVerified) {
        return NextResponse.json(
          { success: false, message: "User already exists" },
          { status: 400 }
        );
      } else {
        // Update unverified user with new password and code
        const hashedPassword = await bcrypt.hash(password, 10);

        existingUser.password = hashedPassword;
        existingUser.verifyCode = verifyCode;
        existingUser.verifyCodeExpiry = verifyCodeExpiry;
        await existingUser.save();

        const emailRes = await sendVerificationEmail?.(email, `${firstName} ${lastName}`, verifyCode);
        if (emailRes && !emailRes.success) {
          return NextResponse.json({ success: false, message: emailRes.message }, { status: 500 });
        }

        return NextResponse.json({
          success: true,
          message: "Verification code resent. Please check your email.",
        }, { status: 200 });
      }
    }

    // Hash password for new user
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      verifyCode,
      verifyCodeExpiry,
      isVerified: false
    });

    await newUser.save();

    const emailRes = await sendVerificationEmail?.(email, `${firstName} ${lastName}`, verifyCode);
    if (emailRes && !emailRes.success) {
      return NextResponse.json({ success: false, message: emailRes.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: "User registered successfully. Please verify your email."
    }, { status: 201 });

  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { success: false, message: "Error registering user" },
      { status: 500 }
    );
  }
}
