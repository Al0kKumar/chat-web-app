import multer from 'multer';
import { Request, Response, NextFunction } from 'express';

const allowedFileTypes = /jpeg|jpg|png|gif/;

const upload = multer({
  storage: multer.memoryStorage(), // Store file in memory as a Buffer
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit 
  },
  fileFilter: (req, file, cb) => {

    const isValidMimeType = allowedFileTypes.test(file.mimetype);

    const isValidExt = allowedFileTypes.test(file.originalname.toLowerCase());

    if (isValidMimeType && isValidExt) {
      cb(null, true); // Accept the file
    } else {
      // Reject the file and provide an error message
      cb(new Error('Invalid file type. Only JPEG, JPG, PNG, and GIF images are allowed.'));
    }
  },
});

// This middleware function wraps Multer's single upload to catch Multer-specific errors
export const uploadProfileImage = (req: Request, res: Response, next: NextFunction) => {
  // 'profilePic' is the field name from your HTML form input (e.g., <input type="file" name="profilePic">)
  upload.single('profilePic')(req, res, (err) => {
    if (err instanceof multer.MulterError) {

      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(413).json({ message: 'File size too large. Max 5MB allowed.' });
      }
      return res.status(400).json({ message: `Upload error: ${err.message}` });
    } else if (err) {

      if (err.message === 'Invalid file type. Only JPEG, JPG, PNG, and GIF images are allowed.') {
        return res.status(400).json({ message: err.message });
      }
      return res.status(500).json({ message: `An unexpected error occurred during upload: ${err.message}` });
    }
    next();
  });
};