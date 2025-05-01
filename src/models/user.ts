import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  googleId: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  avatar: { type: String },
  liked: { type: [mongoose.Schema.Types.ObjectId], ref: "Audio" },
});

export default mongoose.model("User", UserSchema);
