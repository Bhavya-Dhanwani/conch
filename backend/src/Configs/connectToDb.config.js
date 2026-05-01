import mongoose from "mongoose";

const connectToDb = async () => {
  const mongoUri = (process.env.MONGO_URI || process.env.DB_URI || "").trim();
  const dbName = (process.env.DB_NAME || "CONCH").trim();

  if (!mongoUri) {
    throw new Error("DB_URI or MONGO_URI is required to connect MongoDB");
  }

  try {
    await mongoose.connect(mongoUri, { dbName });
    console.log(`DB is Connected! Database: ${dbName}`);
  } catch (error) {
    if (error.message?.toLowerCase().includes("bad auth")) {
      throw new Error(
        "MongoDB authentication failed. Check MONGO_URI username/password, and URL-encode special characters in the password.",
      );
    }

    throw error;
  }
};

export default connectToDb;
