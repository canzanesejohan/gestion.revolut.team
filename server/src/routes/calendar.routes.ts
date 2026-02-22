import { Router } from "express";
import { getCalendarEvents, reschedule, getWorkload } from "../controllers/calendar.controller.js";
import { authenticate, authorize } from "../middleware/auth.middleware.js";

const router = Router();

router.use(authenticate);
router.get("/", getCalendarEvents);
router.patch("/reschedule", authorize("ADMIN", "MANAGER"), reschedule);
router.get("/workload", getWorkload);

export default router;
