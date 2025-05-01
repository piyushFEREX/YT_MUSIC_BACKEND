import mongoose from "mongoose";
import dotenv from "dotenv";
import { GridFSBucket, Db } from "mongodb";

dotenv.config();

let bucket: GridFSBucket | null = null;

const connectDB = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGO_URI as string);
    console.log("✅ MongoDB Connected Successfully!");

    const db: Db = mongoose.connection.db!;
    if (!db) {
      throw new Error("Failed to get the database instance.");
    }
    bucket = new GridFSBucket(db, { bucketName: "AudioBucket" });
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error);
    process.exit(1);
  }
};

export { bucket };
export default connectDB;
