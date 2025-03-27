import dotenv from "dotenv"; // Load .env first
import app from "./app";
import connectDB from "./config/db.config";

dotenv.config(); // Ensure this runs before anything else
// Connect to DB
connectDB();

const port = process.env.PORT || 3000;



app.listen(port, () => {
  console.log("====================================");
  console.log(`🚀 Server is running on http://localhost:${port}`);
  console.log(`📅 Started at: ${new Date().toLocaleString()}`);
  console.log(`📡 Listening on PORT: ${port}`);
  console.log("====================================");
});
