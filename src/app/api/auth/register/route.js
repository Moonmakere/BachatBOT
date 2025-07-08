// pages/api/register.js
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectDB from "../../../../lib/mongoDb";
import User from "../../../../models/userModel";

export async function POST(req) {
  try {
    await connectDB();
    const { firstName, lastName, email, password } = await req.json();

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    return NextResponse.json({ message: "User registered successfully!" }, { status: 201 });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json({ error: "Error registering user" }, { status: 500 });
  }
}
