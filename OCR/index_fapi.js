import express from 'express';
import multer from 'multer';
import path from 'path';
import cors from 'cors';
import 'dotenv/config';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { spawn } from 'child_process';
import { GoogleGenerativeAI } from '@google/generative-ai';
 
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
 
// const apiKey = process.env.GEMINI_API_KEY;
const apiKey = process.env.FUNCTION_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: 'google/gemma-7b-it' });
 
const PORT = process.env.PORT || 3002;
const UPLOADS_DIR = './uploads';
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_FILE_TYPES = ['.pdf', '.png', '.jpg', '.jpeg'];
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second
 
const app = express();
 
 
app.use(cors({
  origin:'http://localhost:3000',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
  credentials: true,
}));
 
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (!fs.existsSync(UPLOADS_DIR)) {
      fs.mkdirSync(UPLOADS_DIR, { recursive: true });
    }
    cb(null, UPLOADS_DIR);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  }
});
 
const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (ALLOWED_FILE_TYPES.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error(`File type '${ext}' is not supported. Allowed types: ${ALLOWED_FILE_TYPES.join(', ')}`));
  }
};
 
const upload = multer({
  storage,
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter
});
 
const imageToBase64 = (filePath) => {
  try {
    const img = fs.readFileSync(filePath);
    return Buffer.from(img).toString('base64');
  } catch (error) {
    console.error('Error converting image to base64:', error);
    return null;
  }
};
 
const runOCR = async (filePath, retries = MAX_RETRIES) => {
  const executeOCR = () => {
    return new Promise((resolve, reject) => {
      const pythonProcess = spawn('python', ['ocr.py', filePath]);
      let result = '';
      let error = '';
 
      pythonProcess.stdout.on('data', (data) => result += data.toString());
      pythonProcess.stderr.on('data', (data) => error += data.toString());
 
      pythonProcess.on('close', async (code) => {
        if (code !== 0) {
          reject(new Error(`OCR process failed with code ${code}: ${error}`));
          return;
        }
        try {
          const ocrResult = JSON.parse(result);
          console.log('Raw OCR Result:', {
            hasExtractedImage: !!ocrResult.extracted_image,
            extractedImageLength: ocrResult.extracted_image ? ocrResult.extracted_image.length : 0
          });
         
          if (ocrResult.extracted_image) {
            ocrResult.processed_image = ocrResult.extracted_image;
          }
         
          resolve(ocrResult);
        } catch (e) {
          reject(new Error(`Failed to parse OCR results: ${e.message}`));
        }
      });
    });
  };
 
  let lastError;
  for (let i = 0; i < retries; i++) {
    try {
      return await executeOCR();
    } catch (error) {
      lastError = error;
      if (i < retries - 1) {
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY * (i + 1)));
      }
    }
  }
  throw lastError;
};
 
 
 
 
async function getSummary(text, imageContent) {
  const prompt = `part 1: Extract the following information from this expense/bill document text and return only a JSON object:
       
        Fields to extract:
        - total_amount: The total bill amount (numeric value only)
        - date: Date in ISO format if available
        - organization: Vendor or merchant name
        - document_number: Invoice or receipt number
        - payment_method: How it was paid (Cash, Card, UPI, etc.)
        - category: Type of expense (Food, Transport, etc.)
        - tax_id: Any GST or tax identification number
        - is_tax_deductible: true/false based on document type
 
        please use null values for any missing fields.
        part 2: Generate a summary of the document, including the extracted information and any other relevant details.
        given the following text and image content of user's finacial document:
        also Provide personalized tax-saving and investment insights, considering the Indian tax laws.
 
  Extracted Text: ${text}
 
  Image Content Description: ${imageContent}
 
  Please format the summary in a clear, readable way.`;
 
  console.log('Prompt sent to Google Gemini:', prompt);  // Log the prompt
 
  try {
    // Call Google Gemini API to generate content
    const result = await model.generateContent(prompt);
    // console.log('Google Gemini Response:', result);  // Log the API response
    console.log('Function Response:', result);  // Log the API response
 
    // Log the candidates array to inspect its structure
    console.log('Candidates:', result.response.candidates);
 
    // Check if candidates exists and has at least one item
    if (result.response.candidates && result.response.candidates.length > 0) {
      const candidate = result.response.candidates[0];
     
      // Extract the text from the 'parts' array inside 'content'
      const summary = candidate.content.parts[0];  // Assuming the text is in the first part
     
      console.log('Generated Summary:', summary);  // Log the summary text
      return summary || 'No summary generated.';  // Return the summary or a fallback message
    } else {
      console.error('No candidates available in the response.');
      return 'Summary generation failed. No candidates returned.';
    }
  } catch (error) {
    console.error('Error generating summary with function api:', error);
    return {
      summary: 'Summary generation failed. Please try again later.',
      extracted_text: text,
      error: error.message
    };
  }
}
 
 
app.post('/upload', upload.array('files'), async (req, res) => {
  console.log('Uploaded files:', req.files);
  const uploadedFiles = [];
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }
 
    const processingResults = await Promise.all(req.files.map(async (file) => {
      uploadedFiles.push(file.path);
      try {
        const ocrResult = await runOCR(file.path);
        const summaryResult = await getSummary(
          ocrResult.extracted_text,
          `This is a ${path.extname(file.originalname).slice(1).toUpperCase()} document with ${ocrResult.word_count} words and ${ocrResult.character_count} characters.`
        );
 
        return {
          fileName: file.originalname,
          documentType: path.extname(file.originalname).slice(1).toUpperCase(),
          extractedText: ocrResult.extracted_text,
          processedImage: ocrResult.processed_image,
          summary: summaryResult.summary || summaryResult
        };
      } catch (error) {
        console.error(`Error processing file ${file.originalname}:`, error);
        return {
          fileName: file.originalname,
          error: error.message
        };
      }
    }));
 
    res.json({ files: processingResults });
  } catch (error) {
    console.error('Error handling upload:', error);
    res.status(500).json({ error: 'An error occurred while processing the files' });
  } finally {
    // Cleanup uploaded files
    for (const filePath of uploadedFiles) {
      fs.unlink(filePath, (err) => {
        if (err) console.error(`Error deleting file ${filePath}:`, err);
      });
    }
  }
});
 
 
 
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
 