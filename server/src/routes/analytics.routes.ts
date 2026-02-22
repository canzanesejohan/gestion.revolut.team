import { Router } from "express";
import { getVelocity, getCompliance, getAvgTime, getInsights, getTeamStats } from "../controllers/analytics.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = Router();

router.use(authenticate);
router.get("/velocity", getVelocity);
router.get("/compliance", getCompliance);
router.get("/avg-time", getAvgTime);
router.get("/insights", getInsights);
router.get("/team", getTeamStats);

export default router;
