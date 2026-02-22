import { Router } from "express";
import { getTemplates, getTemplateById, createTemplate, createFromTemplate } from "../controllers/template.controller.js";
import { authenticate, authorize } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { createTemplateSchema } from "../validators/template.validator.js";

const router = Router();

router.use(authenticate);
router.get("/", getTemplates);
router.get("/:id", getTemplateById);
router.post("/", authorize("ADMIN", "MANAGER"), validate(createTemplateSchema), createTemplate);
router.post("/from-template", authorize("ADMIN", "MANAGER"), createFromTemplate);

export default router;
