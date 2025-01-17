import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { promisify } from 'util';

// Create the uploads folder if it doesn't exist
const UPLOAD_DIR = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR);
}

// Set up multer for handling file uploads
const storage = multer.diskStorage({
  destination: UPLOAD_DIR,
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage });
const unlinkAsync = promisify(fs.unlink);

// Handle file uploads with scheduled deletion
export const config = {
  api: {
    bodyParser: false, // Disable default body parser to handle file uploads
  },
};

export default async (req, res) => {
  // Handle CORS Preflight request (OPTIONS method)
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(204).end(); // No content for OPTIONS request
  }

  // Allow CORS for all requests
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST');

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  upload.single('file')(req, {}, async (err) => {
    if (err) {
      console.error('File upload error:', err);
      return res.status(500).json({ error: 'Failed to upload file' });
    }

    const fileUrl = `${req.headers.origin}/api/uploads/${req.file.filename}`;
    console.log(`File uploaded: ${req.file.filename}`);

    // Schedule deletion of the file after 10 minutes
    setTimeout(async () => {
      const filePath = path.join(UPLOAD_DIR, req.file.filename);
      try {
        await unlinkAsync(filePath);
        console.log(`File deleted: ${req.file.filename}`);
      } catch (deleteError) {
        console.error(`Failed to delete ${req.file.filename}:`, deleteError);
      }
    }, 10 * 60 * 1000); // 10 minutes in milliseconds

    // Respond with the file URL
    res.json({ fileUrl });
  });
};
