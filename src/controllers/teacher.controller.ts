import { Request, Response } from "express";

import { NoContentResponse } from "@/core/base-response";
import { TeacherService } from "@/services/teacher.service";
import { RegisterStudentsReqBody } from "@/schemas/requests/register-students.request";

export class TeacherController {
  /* Register students to a specified teacher */
  public static async registerStudents(
    req: Request<{}, {}, RegisterStudentsReqBody>,
    res: Response
  ) {
    await TeacherService.registerStudents(req.body);
    NoContentResponse.send(res);
  }
}
