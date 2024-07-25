import { Router } from "express";
import {
  authSateController,
  createUserController,
  forgotPassword,
  genereteAccessToken,
  loginController,
  recoverPassword,
  resetPassword,
} from "../controllers/auth.controller";
import { isAuthenticatedUser } from "../middlewares/auth";
const router = Router();
router.post("/register/customer", createUserController);

router.post("/login", loginController);
router.get("/auth-state", isAuthenticatedUser, authSateController);
router.post("/refreshToken", genereteAccessToken);
router.put("/reset-password", isAuthenticatedUser, resetPassword);
router.post("/forgot-password", forgotPassword);
router.put("/recover-password", recoverPassword);
const authRoute = router;
export default authRoute;
