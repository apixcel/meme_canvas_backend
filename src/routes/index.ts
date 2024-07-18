import express from "express";
import authRoute from "./auth.route";
import projectRoutes from "./project.route";

const router = express.Router();

const moduleRoute = [
  {
    path: "/auth",
    route: authRoute,
  },
  {
    path: "/project",
    route: projectRoutes,
  },
];

moduleRoute.forEach((route) => router.use(route.path, route.route));

export default router;