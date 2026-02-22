import { Router } from "express";
import { getCheckins, createCheckin, getCheckinSummary, getBlockers, resolveBlocker } from "../controllers/checkin.controller.js";
import { authenticate, authorize } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { createCheckinSchema } from "../validators/checkin.validator.js";

const router = Router();

router.use(authenticate);
router.get("/", getCheckins);
router.get("/summary", getCheckinSummary);
router.get("/blockers", getBlockers);
router.post("/", validate(createCheckinSchema), createCheckin);
router.patch("/blockers/:id", authorize("ADMIN", "MANAGER"), resolveBlocker);

export default router;
