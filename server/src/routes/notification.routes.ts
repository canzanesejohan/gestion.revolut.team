import { Router } from "express";
import { getNotifications, markAsRead, markAllAsRead, getUnreadCount } from "../controllers/notification.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = Router();

router.use(authenticate);
router.get("/", getNotifications);
router.get("/unread", getUnreadCount);
router.patch("/:id/read", markAsRead);
router.patch("/read-all", markAllAsRead);

export default router;
