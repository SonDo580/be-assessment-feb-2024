import { app } from "./app";
import { GENERAL_CONFIG } from "./config";
import { connectDB, disconnectDB } from "./database/connection";

const { PORT } = GENERAL_CONFIG;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
  });
});

// Ctrl+C
process.on("SIGINT", async () => {
  await disconnectDB();
  process.exit(0);
});

// 'kill' command
process.on("SIGTERM", async () => {
  await disconnectDB();
  process.exit(0);
});
