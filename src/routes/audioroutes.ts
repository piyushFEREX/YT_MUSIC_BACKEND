import { Router } from "express";
import { uploadAudio, getAllAudio, getFile, streamAudio, getSongDetails } from "../controllers/audioControllor";
import { uploadAudioWithThumbnail, uploadMiddleware } from "../middlewares/upload";
import multer from "multer";

const router = Router();
const storage = multer.memoryStorage()
const upload = multer({storage})
// Define Routes
router.post("/upload",upload.fields([{name:'audio' , maxCount:1},{name:'thumbnail', maxCount:1}]),uploadAudio);
router.get("/watch/:id", streamAudio);
// router.post("/like/:id", likeAudio);
router.get("/fetch", getAllAudio);
router.get("/details/:id",getSongDetails);



export default router;
