import multer from "multer";
import { Request, Response, NextFunction } from "express";

// Configure Multer to handle multiple file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

export const uploadAudioWithThumbnail = upload.fields([
  { name: "audio", maxCount: 1 },
  { name: "thumbnail", maxCount: 1 },
]);

export const uploadMiddleware = (req: Request, res: Response, next: NextFunction):any => {
  if (!req.files || !("audio" in req.files) || !("thumbnail" in req.files)) {
    return res.status(400).json({ message: "Audio and thumbnail are required" });
  }
  next();
};
