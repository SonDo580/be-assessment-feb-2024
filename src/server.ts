import { app } from "./app";
import { GENERAL_CONFIG } from "./config";
import { connectDB } from "./database/connect-db";

const { PORT } = GENERAL_CONFIG;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
  });
});
