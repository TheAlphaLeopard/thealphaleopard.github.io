import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { promisify } from 'util';

// Create a storage folder
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

// Handle file upload with timeout deletion
export const config = {
  api: {
    bodyParser: false, // Required for file uploads
  },
};

export default async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  upload.single('file')(req, {}, async (err) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to upload file' });
    }

    const fileUrl = `${req.headers.origin}/api/uploads/${req.file.filename}`;
    console.log(`File uploaded: ${req.file.filename}`);

    // Schedule file deletion after 10 minutes
    setTimeout(async () => {
      const filePath = path.join(UPLOAD_DIR, req.file.filename);
      try {
        await unlinkAsync(filePath);
        console.log(`Deleted ${req.file.filename}`);
      } catch (e) {
        console.error(`Error deleting file ${req.file.filename}:`, e);
      }
    }, 10 * 60 * 1000);

    res.json({ fileUrl });
  });
};
