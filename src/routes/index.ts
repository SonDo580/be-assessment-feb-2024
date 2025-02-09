import { Router } from "express";

import { teacherRouter } from "./teacher.route";

export const router = Router();

router.use("/", teacherRouter);
