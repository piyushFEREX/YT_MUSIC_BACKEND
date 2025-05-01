import mongoose from "mongoose";

export interface IAudio extends Document {
    title: string;
    artist: string;
    mood?: string;
    genre?: string;
    type?:string;
    duration: number;
    fileId: mongoose.Types.ObjectId;
    thumbnail: string;
    likedBy: mongoose.Types.ObjectId[];
    disLikedBy: mongoose.Types.ObjectId[];
}

const AudioSchema = new mongoose.Schema<IAudio>(
    {
        title: { type: String, required: true },
        artist: { type: String, required: true },
        mood: { type: String, required: false },
        genre: { type: String, required: false },
        thumbnail: { type: String, required: true },
        duration: { type: Number, required: true, default: 0 }, // Defaults to 0
        type:{type:String , required:false , default: 'audio'},
        fileId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "fs.files" }, // GridFS File ID
        likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User", default: [] }],
        disLikedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User", default: [] }],
    },
    { timestamps: true } // Automatically manages createdAt and updatedAt
);

export default mongoose.model<IAudio>("Audio", AudioSchema);
