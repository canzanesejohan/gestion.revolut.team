import { Router } from "express";
import { getDeliveries, getDeliveryById, createDelivery, updateDelivery, changeStatus, getStats } from "../controllers/delivery.controller.js";
import { authenticate, authorize } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { createDeliverySchema, updateDeliverySchema, changeStatusSchema } from "../validators/delivery.validator.js";

const router = Router();

router.use(authenticate);
router.get("/", getDeliveries);
router.get("/stats", getStats);
router.get("/:id", getDeliveryById);
router.post("/", authorize("ADMIN", "MANAGER"), validate(createDeliverySchema), createDelivery);
router.put("/:id", authorize("ADMIN", "MANAGER"), validate(updateDeliverySchema), updateDelivery);
router.patch("/:id/status", validate(changeStatusSchema), changeStatus);

export default router;
