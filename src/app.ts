import express from "express";

import { GENERAL_CONFIG } from "@/config";

const app = express();

app.get("/", (req, res) => {
  res.status(200).json({ message: "Hello" });
});

const { PORT } = GENERAL_CONFIG;
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
