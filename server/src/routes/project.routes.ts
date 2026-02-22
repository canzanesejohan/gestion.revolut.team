import { Router } from "express";
import { getProjects, getProjectById, createProject, updateProject, deleteProject } from "../controllers/project.controller.js";
import { authenticate, authorize } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { createProjectSchema, updateProjectSchema } from "../validators/project.validator.js";

const router = Router();

router.use(authenticate);
router.get("/", getProjects);
router.get("/:id", getProjectById);
router.post("/", authorize("ADMIN", "MANAGER"), validate(createProjectSchema), createProject);
router.put("/:id", authorize("ADMIN", "MANAGER"), validate(updateProjectSchema), updateProject);
router.delete("/:id", authorize("ADMIN"), deleteProject);

export default router;
