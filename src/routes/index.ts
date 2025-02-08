import express from "express";

import { teacherRouter } from "./teacher.route";

export const router = express.Router();

router.use('/', teacherRouter);

