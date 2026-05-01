import "dotenv/config";
import app from "./src/app.js";
import connectToDb from "./src/Configs/connectToDb.config.js";

const PORT = process.env.PORT || 8080;

connectToDb()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Express server running on ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  });
