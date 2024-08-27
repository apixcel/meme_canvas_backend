import { Router } from "express";
import {
  updateUserInfo,
  updateUserProfileImage,
} from "../controllers/user.controller";
import { isAuthenticatedUser } from "../middlewares/auth";
import { upload } from "../utils/uploadFile";
const router = Router();
router.put(
  "/update-profile-image",
  isAuthenticatedUser,
  upload.single("file"),
  updateUserProfileImage
);
router.put("/update", isAuthenticatedUser, updateUserInfo);
const userRoute = router;
export default userRoute;
