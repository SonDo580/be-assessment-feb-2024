import express from "express";

export const teacherRouter = express.Router();

teacherRouter.get("/register", (req, res) => {
  res.json({ message: "hello" });
});
