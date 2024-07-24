import { Router } from "express";
import {
  authSateController,
  createUserController,
  genereteAccessToken,
  loginController,
} from "../controllers/auth.controller";
import { isAuthenticatedUser } from "../middlewares/auth";
const router = Router();
router.post("/register/customer", createUserController);

router.post("/login", loginController);
router.get("/auth-state", isAuthenticatedUser, authSateController);
router.post("/refreshToken", genereteAccessToken);
const authRoute = router;
export default authRoute;
