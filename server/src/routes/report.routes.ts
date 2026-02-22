import { Router } from "express";
import { getReportConfigs, createReportConfig, generateReport, previewReport } from "../controllers/report.controller.js";
import { authenticate, authorize } from "../middleware/auth.middleware.js";

const router = Router();

router.use(authenticate);
router.get("/", getReportConfigs);
router.post("/", authorize("ADMIN", "MANAGER"), createReportConfig);
router.post("/:id/generate", authorize("ADMIN", "MANAGER"), generateReport);
router.get("/:id/preview", previewReport);

export default router;
