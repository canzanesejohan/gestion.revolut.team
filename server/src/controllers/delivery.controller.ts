import type { Request, Response } from "express";
import type { AuthRequest } from "../types/index.js";
import * as deliveryService from "../services/delivery.service.js";
import { createNotification } from "../services/notification.service.js";

export async function getDeliveries(req: Request, res: Response) {
  const deliveries = await deliveryService.getAllDeliveries({
    projectId: req.query.projectId as string,
    assigneeId: req.query.assigneeId as string,
    status: req.query.status as any,
    type: req.query.type as string,
  });
  res.json(deliveries);
}

export async function getDeliveryById(req: Request, res: Response) {
  const delivery = await deliveryService.getDeliveryById(req.params.id);
  if (!delivery) {
    res.status(404).json({ error: "Entrega no encontrada" });
    return;
  }
  res.json(delivery);
}

export async function createDelivery(req: AuthRequest, res: Response) {
  const delivery = await deliveryService.createDelivery(req.body);

  const io = req.app.get("io");
  io?.emit("delivery:created", delivery);

  res.status(201).json(delivery);
}

export async function updateDelivery(req: AuthRequest, res: Response) {
  const delivery = await deliveryService.updateDelivery(req.params.id, req.body);

  const io = req.app.get("io");
  io?.emit("delivery:updated", delivery);

  res.json(delivery);
}

export async function changeStatus(req: AuthRequest, res: Response) {
  const { status, note } = req.body;
  const userId = req.user!.userId;

  const result = await deliveryService.changeDeliveryStatus(
    req.params.id,
    status,
    userId,
    note
  );

  const io = req.app.get("io");

  // Broadcast status change
  io?.emit("delivery:statusChanged", result);

  // Notify manager on critical status changes
  const criticalStatuses = ["DELAYED", "BLOCKED"];
  if (criticalStatuses.includes(status)) {
    const managerId = result.delivery.project.managerId;
    await createNotification(
      {
        userId: managerId,
        type: "STATUS_CHANGE",
        title: `Entrega ${status === "DELAYED" ? "retrasada" : "bloqueada"}`,
        message: `"${result.delivery.title}" cambió a ${status}. Proyecto: ${result.delivery.project.name}.`,
        deliveryId: result.delivery.id,
        sendTelegram: true,
      },
      io
    );
  }

  if (status === "COMPLETED") {
    const managerId = result.delivery.project.managerId;
    await createNotification(
      {
        userId: managerId,
        type: "STATUS_CHANGE",
        title: "Entrega completada",
        message: `"${result.delivery.title}" ha sido completada por ${result.delivery.assignee.name}.`,
        deliveryId: result.delivery.id,
        sendTelegram: false,
      },
      io
    );
  }

  res.json(result);
}

export async function getStats(_req: Request, res: Response) {
  const stats = await deliveryService.getDeliveryStats();
  res.json(stats);
}
