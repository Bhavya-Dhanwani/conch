import mongoose from "mongoose";

let isConnected = false;

export async function connectDB() {
  if (isConnected) return;
  if (!process.env.DB_URL) {
    throw new Error("DB_URL is not configured");
  }

  try {
    await mongoose.connect(process.env.DB_URL);
    isConnected = true;
    console.log("✅ MongoDB Connected");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    throw err;
  }
}
