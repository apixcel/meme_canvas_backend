import express from "express";
import authRoute from "./auth.route";
import planRoute from "./plan.route";
import projectRoutes from "./project.route";
import subscriptionRoute from "./subscription.route";
import templateRoute from "./template.route";
import userRoute from "./user.route";

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
  {
    path: "/user",
    route: userRoute,
  },
  {
    path: "/plan",
    route: planRoute,
  },
  {
    path: "/subscription",
    route: subscriptionRoute,
  },
  {
    path: "/template",
    route: templateRoute,
  },
];

moduleRoute.forEach((route) => router.use(route.path, route.route));

export default router;
