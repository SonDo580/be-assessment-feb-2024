import { Request, Response } from "express";
import httpStatus from "http-status";

import { TeacherController } from "@/controllers/teacher.controller";
import { TeacherService } from "@/services/teacher.service";
import { CommonStudentsResBody } from "@/schemas/responses/common-students.response";
import { NotificationReceiversResBody } from "@/schemas/responses/notification-receivers.response";

// Mock TeacherService
jest.mock("@/services/teacher.service");

describe("Teacher Controller", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;

  let jsonMock: jest.Mock;
  let statusMock: jest.Mock;
  let sendMock: jest.Mock;

  beforeEach(() => {
    jsonMock = jest.fn();
    sendMock = jest.fn();
    statusMock = jest.fn().mockReturnThis(); // for chaining

    req = { body: {}, query: {} };
    res = { json: jsonMock, status: statusMock, send: sendMock };
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("should call TeacherService.registerStudents and return NoContentResponse", async () => {
    (TeacherService.registerStudents as jest.Mock).mockResolvedValue(undefined);

    await TeacherController.registerStudents(req as Request, res as Response);

    expect(TeacherService.registerStudents).toHaveBeenCalledWith(req.body);
    expect(sendMock).toHaveBeenCalled();
    expect(statusMock).toHaveBeenCalledWith(httpStatus.NO_CONTENT);
  });

  it("should call TeacherService.getCommonStudents and return SuccessResponse", async () => {
    const mockResponse: CommonStudentsResBody = {
      students: ["student1@example.com", "student2@example.com"],
    };
    (TeacherService.getCommonStudents as jest.Mock).mockResolvedValue(
      mockResponse
    );

    await TeacherController.getCommonStudents(req as Request, res as Response);

    expect(TeacherService.getCommonStudents).toHaveBeenCalledWith(req.query);
    expect(jsonMock).toHaveBeenCalledWith(mockResponse);
    expect(statusMock).toHaveBeenCalledWith(httpStatus.OK);
  });

  it("should call TeacherService.suspendStudent and return NoContentResponse", async () => {
    (TeacherService.suspendStudent as jest.Mock).mockResolvedValue(undefined);

    await TeacherController.suspendStudent(req as Request, res as Response);

    expect(TeacherService.suspendStudent).toHaveBeenCalledWith(req.body);
    expect(sendMock).toHaveBeenCalled();
    expect(statusMock).toHaveBeenCalledWith(httpStatus.NO_CONTENT);
  });

  it("should call TeacherService.getCommonStudents and return SuccessResponse", async () => {
    const mockResponse: NotificationReceiversResBody = {
      recipients: ["student1@example.com", "student2@example.com"],
    };
    (TeacherService.getNotificationReceivers as jest.Mock).mockResolvedValue(
      mockResponse
    );

    await TeacherController.getNotificationReceivers(
      req as Request,
      res as Response
    );

    expect(TeacherService.getNotificationReceivers).toHaveBeenCalledWith(
      req.body
    );
    expect(jsonMock).toHaveBeenCalledWith(mockResponse);
    expect(statusMock).toHaveBeenCalledWith(httpStatus.OK);
  });
});
