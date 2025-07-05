import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import connectDB from "../../../lib/mongoDb";
import ExtractedData from "../../../models/extractedData";

export async function GET(req) {
  try {
    await connectDB();

    const token = req.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ error: "No token provided" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    const data = await ExtractedData.find({ user: userId }).sort({ createdAt: -1 });

    return NextResponse.json({ data });
  } catch (error) {
    console.error("❌ Error fetching extracted data:", error);
    return NextResponse.json({ error: "Error fetching data" }, { status: 500 });
  }
}
