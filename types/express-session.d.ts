import "express-session";
import { User } from "../src/models/user"; // Adjust the import path based on your User model

declare module "express-session" {
  interface SessionData {
    user?: User; // Ensure it matches your user object structure
  }
}
