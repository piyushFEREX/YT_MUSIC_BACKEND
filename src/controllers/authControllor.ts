import { Request, Response, NextFunction } from "express";
import passport from "passport";

// Redirect user to Google login
export const googleAuth = passport.authenticate("google", { scope: ["profile", "email"] });

// Handle Google OAuth callback
export const googleCallback = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate("google", { failureRedirect: "/" }, (err, user) => {
    if (err || !user) return res.redirect("/"); // Handle auth failure
    req.logIn(user, (loginErr) => {
      if (loginErr) return next(loginErr);
      return res.redirect("/dashboard"); // Redirect on success
    });
  })(req, res, next);
};

// Logout user
export const logout = (req: Request, res: Response) => {
  req.logout((err) => {
    if (err) return res.send("Error logging out");
    res.redirect("/");
  });
};

// Get the currently logged-in user
export const getCurrentUser = (req: Request, res: Response) => {
  if (!req.user) return res.status(401).json({ message: "Not authenticated" });
  res.json(req.user);
};
