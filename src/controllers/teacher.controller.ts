import { Request, Response } from "express";

import { NoContentResponse, SuccessResponse } from "@/core/base-response";
import { TeacherService } from "@/services/teacher.service";
import { RegisterStudentsReqBody } from "@/schemas/requests/register-students.request";
import { SuspendStudentReqBody } from "@/schemas/requests/suspend-student.request";
import { CommonStudentsReqQuery } from "@/schemas/requests/common-students.request";
import { CommonStudentsResBody } from "@/schemas/responses/common-students.response";
import { NotificationReceiverReqBody } from "@/schemas/requests/notification-receivers.request";
import { NotificationReceiversResBody } from "@/schemas/responses/notification-receivers.response";

export class TeacherController {
  /* Register students to a specified teacher */
  public static async registerStudents(
    req: Request<{}, {}, RegisterStudentsReqBody>,
    res: Response
  ) {
    await TeacherService.registerStudents(req.body);
    NoContentResponse.send(res);
  }

  /* Find common students under a list of teachers */
  public static async getCommonStudents(
    req: Request<{}, CommonStudentsResBody, {}>,
    res: Response
  ) {
    const result = await TeacherService.getCommonStudents(
      req.query as CommonStudentsReqQuery
    );
    new SuccessResponse(result).send(res);
  }

  /* Suspend a student */
  public static async suspendStudent(
    req: Request<{}, {}, SuspendStudentReqBody>,
    res: Response
  ) {
    await TeacherService.suspendStudent(req.body);
    NoContentResponse.send(res);
  }

  /* Retrieve the list of students who can received a notification */
  public static async getNotificationReceivers(
    req: Request<{}, NotificationReceiversResBody, NotificationReceiverReqBody>,
    res: Response
  ) {
    const result = await TeacherService.getNotificationReceivers(req.body);
    new SuccessResponse(result).send(res);
  }
}
