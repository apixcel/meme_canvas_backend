import { Router } from "express";
import {
  createProjectController,
  deleteProject,
  getAllImages,
  getAllProjects,
  getProjectById,
  renameProject,
  updateProjectShapes,
  uploadImage,
} from "../controllers/project.controller";
import { isAuthenticatedUser } from "../middlewares/auth";
import { upload } from "../utils/uploadFile";
const router = Router();

router.get("/get/:id", isAuthenticatedUser, getProjectById);
router.post("/create", isAuthenticatedUser, createProjectController);
router.put("/rename/:id", isAuthenticatedUser, renameProject);
router.put("/update/:id", isAuthenticatedUser, updateProjectShapes);
router.delete("/delete/:id", isAuthenticatedUser, deleteProject);
router.get("/all", isAuthenticatedUser, getAllProjects);
router.post(
  "/upload/image",
  isAuthenticatedUser,
  upload.single("file"),
  uploadImage
);
router.get("/images", isAuthenticatedUser, getAllImages);

const projectRoutes = router;
export default projectRoutes;
