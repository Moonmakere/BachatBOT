// pages/api/user/getUser.js
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import connectDB from "../../../../lib/mongoDb";
import User from "../../../../models/userModel";

export async function GET(request) {
  try {
    await connectDB();

    // Extract token from cookies
    const token = request.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ error: "No token provided" }, { status: 401 });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Send user data (exclude password)
    const userData = {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      panNumber: user.panNumber,
      aadharNumber: user.aadharNumber,
      gstNumber: user.gstNumber,
      accountNumber: user.accountNumber,
      ifscCode: user.ifscCode,
      bankName: user.bankName,
      bankBranch: user.bankBranch,
      address: user.address,
      city: user.city,
      state: user.state,
      pincode: user.pincode,
      companyName: user.companyName,
      businessType: user.businessType,
      phoneNumber: user.phoneNumber,
      alternatePhone: user.alternatePhone
    };

    return NextResponse.json({ user: userData }, { status: 200 });
  } catch (error) {
    console.error("Error fetching user data:", error);
    return NextResponse.json({ error: "Error fetching user data" }, { status: 500 });
  }
}