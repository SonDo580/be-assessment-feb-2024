import { Router } from "express";

import { asyncHandler } from "@/middlewares/error.middleware";
import { TeacherController } from "@/controllers/teacher.controller";
import { validateRequestBody } from "@/middlewares/validate.middleware";
import { RegisterStudentsReqBodySchema } from "@/schemas/requests/register-students.request";

export const teacherRouter = Router();

teacherRouter.post(
  "/register",
  validateRequestBody(RegisterStudentsReqBodySchema),
  asyncHandler(TeacherController.registerStudents)
);