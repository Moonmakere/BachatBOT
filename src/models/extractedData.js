// models/ExtractedData.js
import mongoose from "mongoose";

const ExtractedDataSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    extracted: {
      type: mongoose.Schema.Types.Mixed, // Stores parsed JSON from Gemini
      required: true
    },
    documentType: {
      type: String,
      enum: ["bills", "investment", "spending"],
      required: true
    },
    originalFileName: {
      type: String,
    }
  },
  { timestamps: true }
);

const ExtractedData = mongoose.models.ExtractedData || mongoose.model("ExtractedData", ExtractedDataSchema);
export default ExtractedData;
