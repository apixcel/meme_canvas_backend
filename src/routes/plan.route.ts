import { Router } from "express";
import { createPlan, getAllPlan } from "../controllers/plan.controller";
import { authorizeRoles, isAuthenticatedUser } from "../middlewares/auth";
const router = Router();
router.post(
  "/create",
  isAuthenticatedUser,
  authorizeRoles("admin"),
  createPlan
);
router.get("/get", getAllPlan);

const planRoute = router;
export default planRoute;
