import express from "express";
import { CurrentUser, googleAuth, googleCallback, logout } from "../controllers/authControllor";

const router = express.Router();

// Google OAuth Route
router.get("/google", googleAuth);

// Google OAuth Callback
router.get("/google/callback", googleCallback);

// Logout
router.get("/logout", logout);

//curent user
router.get("/current", CurrentUser)


export default router;
