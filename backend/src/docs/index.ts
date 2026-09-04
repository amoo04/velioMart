import { Hono } from "hono";
import { apiReference } from "@scalar/hono-api-reference";
import { openApiSpec } from "./openapi";

const docsRoutes = new Hono();

docsRoutes.get("/", apiReference({ spec: { content: openApiSpec } }));

export default docsRoutes;
