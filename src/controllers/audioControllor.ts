import { Request, Response } from "express";
import mongoose from "mongoose";
import { Readable } from "stream";
import Audio from "../models/audio.model";
import { bucket } from "../config/db.config";
import audioModel from "../models/audio.model";

// Define Multer file type correctly
interface MulterRequest extends Request {
  files?: {
    audio?: Express.Multer.File[];
    thumbnail?: Express.Multer.File[];
  };
}

// Upload Audio with Thumbnail
export const uploadAudio = async (req: Request, res: Response): Promise<void> => {
  const multerReq = req as MulterRequest;

  if (!multerReq.files?.audio || !multerReq.files?.thumbnail) {
    res.status(400).json({ error: "Audio or thumbnail file is missing" });
    return;
  }

  if (!bucket) {
    res.status(500).json({ message: "Mongoose GridFS bucket error" });
    return;
  }

  try {
    const audioFile = multerReq.files.audio[0];
    const thumbnailFile = multerReq.files.thumbnail[0];
    const audioName = `${Date.now()}_${audioFile.originalname}`;
    const thumbnailName = `${Date.now()}_${thumbnailFile.originalname}`;

    console.log("Uploading Audio File:", audioFile.originalname);
    console.log("Uploading Thumbnail File:", thumbnailFile.originalname);
    console.log("Other Details:", multerReq.body);

    // Function to upload a file to GridFS and return the file ID
    const uploadToGridFS = (fileBuffer: Buffer, fileName: string): Promise<mongoose.Types.ObjectId> => {
      return new Promise((resolve, reject) => {
        if (!bucket) {
          reject(new Error("GridFS bucket is not initialized"));
          return;
        }

        const uploadStream = bucket.openUploadStream(fileName);
        uploadStream.end(fileBuffer);

        uploadStream.on("finish", async () => {
          try {
            if (!bucket) {
              throw new Error("GridFS bucket is not initialized");
            }
            const file = await bucket.find({ filename: fileName }).toArray();
            if (!file || file.length === 0) {
              reject(new Error("Uploaded file not found in MongoDB"));
              return;
            }
            console.log("✅ Uploaded file found in DB:", file[0]);
            resolve(file[0]._id);
          } catch (error) {
            reject(error);
          }
        });

        uploadStream.on("error", (err) => {
          reject(err);
        });
      });
    };

    // Upload both files asynchronously
    const [audioFileId, thumbnailFileId] = await Promise.all([
      uploadToGridFS(audioFile.buffer, audioName),
      uploadToGridFS(thumbnailFile.buffer, thumbnailName),
    ]);

    console.log("Audio File ID:", audioFileId);
    console.log("Thumbnail File ID:", thumbnailFileId);

    // After both files are uploaded, create an entry in MongoDB
    const newAudio = new audioModel({
      title: multerReq.body.title,
      artist: multerReq.body.artist,
      mood: multerReq.body.mood || null,
      genre: multerReq.body.genre || null,
      duration: parseInt(multerReq.body.duration) || 0, // Duration can be updated later
      fileId: audioFileId, // Store GridFS file ID
      thumbnail: thumbnailFileId, // Store GridFS file ID for the thumbnail
      likedBy: [],
    });

    await newAudio.save(); // Save entry in MongoDB

    console.log("Audio saved in DB:", newAudio._id);

    res.json({
      message: "Files uploaded and saved successfully",
      audioId: newAudio._id,
      audioName: audioName,
      thumbnailName: thumbnailName,
    });
  } catch (error) {
    console.error("Error uploading file:", error);
    res.status(500).json({ error: error instanceof Error ? error.message : "Internal server error" });
  }
};

// Like Audio (To be implemented)
export const likeAudio = async (req: Request, res: Response): Promise<void> => {
  // To be implemented
};

// Get All Audio
export const getAllAudio = async (req: Request, res: Response): Promise<void> => {
  try {
    const audioFiles = await Audio.find(); // Fetch all audio records

    // Modify the response to replace `thumbnail` ID with a GridFS URL
    const updatedAudioFiles = audioFiles.map(audio => ({
      ...audio.toObject(),
      thumbnail: `${req.protocol}://${req.get("host")}/api/files/${audio.thumbnail}` // Generate file URL
    }));

    res.status(200).json(updatedAudioFiles);
  } catch (error) {
    console.error("Error fetching audio files:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Route to fetch and serve files from GridFS
export const getFile = async (req: Request, res: Response): Promise<void> => {
  try {
    const fileId = new mongoose.Types.ObjectId(req.params.id); // Convert ID
    if (!bucket) {
      res.status(500).json({ message: "GridFS bucket is not initialized" });
      return;
    }
    const fileStream = bucket.openDownloadStream(fileId);

    fileStream.on("error", () => {
      res.status(404).json({ message: "File not found" });
    });

    fileStream.pipe(res); // Stream file to response
  } catch (error) {
    console.error("Error fetching file:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
export const streamAudio = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log("Requested file ID:", req.params.id);

    if (!bucket) {
      res.status(500).json({ message: "GridFS bucket is not initialized" });
      return;
    }

    const fileId = new mongoose.Types.ObjectId(req.params.id);

    // Check if the file exists
    const files = await bucket.find({ _id: fileId }).toArray();
    if (!files || files.length === 0) {
      res.status(404).json({ message: "File not found in GridFS" });
      return;
    }

    const file = files[0];
    console.log("File found in GridFS:", file);

    const totalSize = file.length;
    const range = req.headers.range;

    if (!range) {
      // Serve full file if no range is requested
      res.set({
        "Content-Type": "audio/mpeg",
        "Content-Length": totalSize,
        "Accept-Ranges": "bytes",
      });

      const fileStream = bucket.openDownloadStream(fileId);
      fileStream.pipe(res);
      return;
    }

    // Extract byte range from headers
    const parts = range.replace(/bytes=/, "").split("-");
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : totalSize - 1;
    const chunkSize = end - start + 1;

    console.log(`Serving range: ${start}-${end} / ${totalSize}`);

    res.status(206).set({
      "Content-Type": "audio/mpeg",
      "Content-Length": chunkSize,
      "Content-Range": `bytes ${start}-${end}/${totalSize}`,
      "Accept-Ranges": "bytes",
    });

    // Stream only requested byte range
    const fileStream = bucket.openDownloadStream(fileId, { start, end });
    fileStream.pipe(res);
  } catch (error) {
    console.error("Error streaming file:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


export const getSongDetails = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const API_URL: string = process.env.API_URL || "http://localhost:2025";

    // Find song by ID
    const song = await Audio.findOne({ fileId: id }).lean() as {
      _id: mongoose.Types.ObjectId;
      title: string;
      artist: string;
      genre?: string;
      mood?: string;
      duration?: number;
      fileId: mongoose.Types.ObjectId;
      type?: string;
      likedBy?: mongoose.Types.ObjectId[];
      disLikedBy?: mongoose.Types.ObjectId[];
      thumbnail?: string;
    };
    if (!song) {
      res.status(404).json({ error: "Song not found" });
      return;
    }

    // Construct URLs for audio and thumbnail
    const thumbnailUrl: string = song.thumbnail ? `${API_URL}/api/files/${song.thumbnail}` : "";
    const songUrl: string = `${API_URL}/song/stream/${song.fileId}`;

    res.json({
      _id: song._id,
      title: song.title,
      artist: song.artist,
      genre: song.genre,
      mood: song.mood || "Unknown",
      duration: song.duration || 0, // Defaults to 0, updates during playback
      fileId: song.fileId,
      type: song.type || "audio",
      likedBy: song.likedBy || [],
      disLikedBy: song.disLikedBy || [],
      thumbnail: thumbnailUrl,
      songUrl, // ✅ Streaming URL added
    });
  } catch (error) {
    console.error("Error fetching song details:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
