export const demoData = {
  logs: `
[10:31] Server started
[10:32] Connecting to DB...
[10:32] ERROR: Connection timeout
[10:33] Retrying...
[10:34] Server crashed
`,

  error: `
MongoNetworkError: connection timed out
`,

  code: `
import mongoose from "mongoose";

export async function connectDB() {
  await mongoose.connect(process.env.DB_URL);
}
`,
};