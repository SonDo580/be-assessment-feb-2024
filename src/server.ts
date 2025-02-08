import { app } from "./app";
import { GENERAL_CONFIG } from "./config";

const { PORT } = GENERAL_CONFIG;

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
