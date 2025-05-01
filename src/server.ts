import dotenv from "dotenv"; // Load .env first
import app from "./app";
import connectDB from "./config/db.config";
import audioroutes from "./routes/audioroutes";
// import "../types/express-session"; // ✅ Import this so TypeScript recognizes `req.session.user`


dotenv.config(); // Ensure this runs before anything else




const port = process.env.PORT || 3000;


connectDB()

  app.listen(port, () => {
    console.log("====================================");
    console.log(`🚀 Server is running on http://localhost:${port}`);
    console.log(`📅 Started at: ${new Date().toLocaleString()}`);
    console.log(`📡 Listening on PORT: ${port}`);
    console.log("====================================");
  });

