// models/userModel.js
import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    // Basic Info
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    
    // Accounting Info
    panNumber: { type: String, trim: true },
    aadharNumber: { type: String, trim: true },
    gstNumber: { type: String, trim: true },
    accountNumber: { type: String, trim: true },
    ifscCode: { type: String, trim: true },
    bankName: { type: String },
    bankBranch: { type: String },
    
    // Address
    address: { type: String },
    city: { type: String },
    state: { type: String },
    pincode: { type: String },
    
    // Business Info
    companyName: { type: String },
    businessType: { type: String },
    
    // Contact Info
    phoneNumber: { type: String },
    alternatePhone: { type: String }
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model("User", UserSchema);

export default User;