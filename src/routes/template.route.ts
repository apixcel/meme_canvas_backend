import { Router } from "express";
import {
  createTemplate,
  deleteTemplate,
  getAllTemplates,
} from "../controllers/template.controler";
import { isAuthenticatedUser } from "../middlewares/auth";
const router = Router();
router.post("/create/:id", isAuthenticatedUser, createTemplate);
router.get("/get", getAllTemplates);
router.delete("/delete/:id", isAuthenticatedUser, deleteTemplate);

const templateRoute = router;
export default templateRoute