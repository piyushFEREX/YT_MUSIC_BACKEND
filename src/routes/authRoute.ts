import express from "express";
import { googleAuth, googleCallback, logout, getCurrentUser } from "../controllers/authControllor";

const router = express.Router();

// Google OAuth Route
router.get("/google", googleAuth);

// Google OAuth Callback
router.get("/google/callback", googleCallback);

// Logout
router.get("/logout", logout);

// Get Current User
router.get("/me", getCurrentUser);

export default router;
