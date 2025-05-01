import { Request, Response, NextFunction } from "express";
import passport from "passport";
import session from "express-session";


declare module "express-session" {
  interface SessionData {
    user?:any ; // Adjust this to match your user model structure
  }}
// Redirect user to Google login
export const googleAuth = passport.authenticate("google", { scope: ["profile", "email"] });

// Handle Google OAuth callback
export const googleCallback = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate("google", { failureRedirect: "/" }, (err, user) => {
    if (err || !user) return res.status(401).json({ message: "Authentication failed" });
    req.logIn(user, (loginErr) => {
      if (loginErr) return next(loginErr);
      req.session.user = user;
      res.redirect(`${process.env.CLIENT_URL}/home`);
    });
  })(req, res, next);
};

// Logout function
export const logout = (req: Request, res: Response, next: NextFunction) => {
  req.session.destroy((err) => {
    if (err) {
      return next(err);
    }
    res.clearCookie('connect.sid'); // Default session cookie name
    res.redirect(`${process.env.CLIENT_URL}/login`);
  });
};

export const CurrentUser = (req: Request, res: Response) => {
  if (req.user) {
    res.status(200).json({ user: req.user });
  } else {
    res.status(401).json({ message: "User not authenticated" });
  }
}

