import { Request, Response, NextFunction } from "express";

// Middleware to check authentication
export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
    if (req.isAuthenticated()) {
      next();
    } else {
      res.status(401).json({ message: "Unauthorized" });
    }}
