import { OpenApiGeneratorV3 } from "@asteasolutions/zod-to-openapi";
import { OpenAPIObjectConfig } from "@asteasolutions/zod-to-openapi/dist/v3.0/openapi-generator";

import { openAPIRegistry } from "./openapi-registry";

export function generateOpenAPIDocs() {
  const config: OpenAPIObjectConfig = {
    openapi: "3.0.0",
    info: {
      version: "1.0.0",
      title: "Student Management",
    },
  };

  const generator = new OpenApiGeneratorV3(openAPIRegistry.definitions);
  const openAPIDocs = generator.generateDocument(config);
  return openAPIDocs;
}
