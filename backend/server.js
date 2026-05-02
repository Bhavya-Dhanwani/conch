import "dotenv/config";
import http from "http";

import app from "./src/app.js";
import connectToDb from "./src/Configs/connectToDb.config.js";
import { initializeSocket } from "./src/socket.js";

const PORT = process.env.PORT || 8080;
const server = http.createServer(app);

initializeSocket(server);

connectToDb()
  .then(() => {
    server.listen(PORT, () => {
      console.log(`Express and Socket.io server running on ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  });
