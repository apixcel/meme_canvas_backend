"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const project_controller_1 = require("../controllers/project.controller");
const auth_1 = require("../middlewares/auth");
const router = (0, express_1.Router)();
router.get("/get/:id", auth_1.isAuthenticatedUser, project_controller_1.getProjectById);
router.post("/create", auth_1.isAuthenticatedUser, project_controller_1.createProjectController);
router.patch("/update/:id", auth_1.isAuthenticatedUser, project_controller_1.updateProjectShapes);
router.delete("/delete/:id", auth_1.isAuthenticatedUser, project_controller_1.updateProjectShapes);
const projectRoutes = router;
exports.default = projectRoutes;
