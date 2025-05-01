import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import session from "express-session";
import passport from "passport";
import indexRoutes from "./routes/indexRoutes";
import authRoutes from "./routes/authRoute";
import { requestLogger } from "./middlewares/requestLogger";
import "./config/passport"; // Ensure Passport strategies are initialized
import { isAuthenticated } from "./middlewares/Authentication";
import audioroutes from "./routes/audioroutes";
// import morgan from "morgan"; // HTTP request logger middleware
// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Middleware
app.use(express.json()); // Parse JSON data
app.use(express.urlencoded({ extended: true })); // Parse form data
app.use(express.static("public")); // Serve static files (not planning to use it)
app.use(express.static("uploads")); // Serve uploads (not planning to use it)
const corsOptions = {
  origin: process.env.CLIENT_URL, // Replace with your client's origin
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Specify allowed HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Specify allowed headers
  credentials: true, // Enable credentials (cookies, authorization headers, etc.)
};

app.use(cors(corsOptions));

// Session Middleware (for authentication)
app.use(
  session({
    secret: process.env.SESSION_SECRET || "default_secret", // Provide fallback
    resave: false,
    saveUninitialized: false,
  })
);
// app.use(morgan("dev")); // Log HTTP requests to the console
// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

// Middleware to log detailed request & response info
app.use(requestLogger);


// Routes
app.use("/", indexRoutes);
app.use("/auth", authRoutes); // Authentication routes
app.use('/song',isAuthenticated,audioroutes)

export default app;
