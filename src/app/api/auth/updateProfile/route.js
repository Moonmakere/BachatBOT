// pages/api/user/updateProfile.js
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import connectDB from "../../../../lib/mongoDb";
import User from "../../../../models/userModel";

export async function PUT(request) {
  try {
    await connectDB();

    // Extract token from cookies
    const token = request.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Parse request body
    const body = await request.json();
    
    // Validate required fields
    if (!body.firstName || !body.lastName || !body.email) {
      return NextResponse.json({ error: "First name, last name, and email are required" }, { status: 400 });
    }
    
    // Find user
    const user = await User.findById(decoded.userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    
    // Check if email is being changed and if it's already in use
    if (body.email !== user.email) {
      const existingUser = await User.findOne({ email: body.email });
      if (existingUser) {
        return NextResponse.json({ error: "Email already in use" }, { status: 400 });
      }
    }
    
    // Update user fields
    // Basic Info
    user.firstName = body.firstName;
    user.lastName = body.lastName;
    user.email = body.email;
    user.phoneNumber = body.phoneNumber;
    user.alternatePhone = body.alternatePhone;
    
    // ID Information
    user.panNumber = body.panNumber;
    user.aadharNumber = body.aadharNumber;
    user.gstNumber = body.gstNumber;
    
    // Bank Details
    user.accountNumber = body.accountNumber;
    user.ifscCode = body.ifscCode;
    user.bankName = body.bankName;
    user.bankBranch = body.bankBranch;
    
    // Address
    user.address = body.address;
    user.city = body.city;
    user.state = body.state;
    user.pincode = body.pincode;
    
    // Business Info
    user.companyName = body.companyName;
    user.businessType = body.businessType;
    
    await user.save();
    
    return NextResponse.json({ message: "Profile updated successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json({ error: "Error updating profile" }, { status: 500 });
  }
}