import { NextResponse } from "next/server";
import path from "path";
import fs from "fs";
import { spawn } from "child_process";
import jwt from "jsonwebtoken";
import connectDB from "../../../lib/mongoDb";
import ExtractedData from "../../../models/extractedData";
export async function POST(req) {
  try {
    await connectDB();

    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "No token provided" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    const formData = await req.formData();
    const file = formData.get("file");
    const documentType = formData.get("documentType");

    if (!file || !documentType) {
      return NextResponse.json(
        { error: "Missing file or document type" },
        { status: 400 }
      );
    }

    const fileBuffer = await file.arrayBuffer();
    const filePath = path.join(process.cwd(), "public/uploads", file.name);
    fs.writeFileSync(filePath, Buffer.from(fileBuffer));

    const pythonScriptPath = path.join(
      process.cwd(),
      "PlakshaOCR/bill_and_expense.py"
    );

    return new Promise((resolve) => {
      const pythonProcess = spawn("python", [pythonScriptPath], {
        stdio: ["pipe", "pipe", "pipe"],
      });

      const imageBuffer = fs.readFileSync(filePath);
      pythonProcess.stdin.write(imageBuffer);
      pythonProcess.stdin.end();

      let output = "";
      pythonProcess.stdout.on("data", (data) => {
        output += data.toString();
      });

      pythonProcess.stderr.on("data", (data) => {
        console.error("❌ OCR Script Error:", data.toString());
      });

      pythonProcess.on("close", async () => {
        try {
          const cleaned = output.replace(/```json|```/g, "").trim();
          const parsed = JSON.parse(cleaned);

          const saved = await ExtractedData.create({
            user: userId,
            extracted: parsed,
            documentType,
            originalFileName: file.name,
          });

          resolve(NextResponse.json(saved));
        } catch (err) {
          console.error("Error saving data:", err);
          resolve(
            NextResponse.json(
              { error: "Error saving parsed data" },
              { status: 500 }
            )
          );
        }
      });
    });
  } catch (error) {
    console.error("❌ API Route Error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
