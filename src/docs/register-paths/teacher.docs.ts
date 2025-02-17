import httpStatus from "http-status";

import { RegisterStudentsReqBodySchema } from "@/schemas/requests/register-students.request";
import { OpenApiTags } from "@/constants/openapi.const";
import { openAPIRegistry } from "../openapi-registry";

const prefixPath = "/api";

openAPIRegistry.registerPath({
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
