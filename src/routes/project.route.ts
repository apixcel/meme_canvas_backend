import { Router } from "express";
import {
  createProjectController,
  getProjectById,
  updateProjectShapes,
} from "../controllers/project.controller";
import { isAuthenticatedUser } from "../middlewares/auth";
const router = Router();

router.get("/get/:id", isAuthenticatedUser, getProjectById);
router.post("/create", isAuthenticatedUser, createProjectController);
router.patch("/update/:id", isAuthenticatedUser, updateProjectShapes);
router.delete("/delete/:id", isAuthenticatedUser, updateProjectShapes);

const projectRoutes = router;
export default projectRoutes;
