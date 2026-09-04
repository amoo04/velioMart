import { Hono } from "hono";
import { searchController } from "./search.controller";

const searchRoutes = new Hono();

searchRoutes.get("/", (c) => searchController.search(c));

export default searchRoutes;
