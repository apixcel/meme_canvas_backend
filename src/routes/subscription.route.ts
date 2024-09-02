import { Router } from "express";
import { createSubscription } from "../controllers/subscription.controller";
import { isAuthenticatedUser } from "../middlewares/auth";
const router = Router();
router.post("/create", isAuthenticatedUser, createSubscription);
const subscriptionRoute = router;
export default subscriptionRoute;
