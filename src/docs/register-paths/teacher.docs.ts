import httpStatus from "http-status";

import { openAPIRegistry } from "../openapi-registry";
import { OpenApiTags } from "@/constants/openapi.const";
import { RegisterStudentsReqBodySchema } from "@/schemas/requests/register-students.request";
import { CommonStudentsReqQuerySchema } from "@/schemas/requests/common-students.request";
import { CommonStudentsResBodySchema } from "@/schemas/responses/common-students.response";
import { SuspendStudentReqBodySchema } from "@/schemas/requests/suspend-student.request";
import { NotificationReceiverReqBodySchema } from "@/schemas/requests/notification-receivers.request";
import { NotificationReceiversResBodySchema } from "@/schemas/responses/notification-receivers.response";

const prefixPath = "/api";

/* Register students */
openAPIRegistry.registerPath({
  description: "Register students under a teacher",
  method: "post",
  path: `${prefixPath}/register`,
  request: {
    body: {
      content: {
        "application/json": {
          schema: RegisterStudentsReqBodySchema,
        },
      },
    },
  },
  responses: {
    [httpStatus.NO_CONTENT]: {
      description: "Success",
    },
    [httpStatus.NOT_FOUND]: {
      description: "Teacher or any students not found",
    },
  },
  tags: [OpenApiTags.TEACHER],
});

/* Get common students */
openAPIRegistry.registerPath({
  description: "Get common students for a list of teachers",
  method: "get",
  path: `${prefixPath}/commonstudents`,
  request: {
    query: CommonStudentsReqQuerySchema,
  },
  responses: {
    [httpStatus.OK]: {
      description: "Success",
      content: {
        "application/json": {
          schema: CommonStudentsResBodySchema,
        },
      },
    },
    [httpStatus.NOT_FOUND]: {
      description: "Teacher not found",
    },
  },
  tags: [OpenApiTags.TEACHER],
});

/* Suspend student */
openAPIRegistry.registerPath({
  description: "Suspend a specified student",
  method: "post",
  path: `${prefixPath}/suspend`,
  request: {
    body: {
      content: {
        "application/json": {
          schema: SuspendStudentReqBodySchema,
        },
      },
    },
  },
  responses: {
    [httpStatus.NO_CONTENT]: {
      description: "Success",
    },
    [httpStatus.NOT_FOUND]: {
      description: "Student not found",
    },
  },
  tags: [OpenApiTags.TEACHER],
});

/* Get notification receivers */
openAPIRegistry.registerPath({
  description: "Retrieve the list of students who can receive a notification",
  method: "post",
  path: `${prefixPath}/retrievefornotifications`,
  request: {
    body: {
      content: {
        "application/json": {
          schema: NotificationReceiverReqBodySchema,
        },
      },
    },
  },
  responses: {
    [httpStatus.OK]: {
      description: "Success",
      content: {
        "application/json": {
          schema: NotificationReceiversResBodySchema,
        },
      },
    },
    [httpStatus.NOT_FOUND]: {
      description: "Teacher not found",
    },
  },
  tags: [OpenApiTags.TEACHER],
});
