import type { Request, Response } from "express";
import type { AuthRequest } from "../types/index.js";
import * as calendarService from "../services/calendar.service.js";

export async function getCalendarEvents(req: Request, res: Response) {
  const { projectIds, assigneeId, from, to } = req.query;
  const events = await calendarService.getCalendarEvents({
    projectIds: projectIds ? (projectIds as string).split(",") : undefined,
    assigneeId: assigneeId as string | undefined,
    from: from as string | undefined,
    to: to as string | undefined,
  });
  res.json(events);
}

export async function reschedule(req: AuthRequest, res: Response) {
  const { deliveryId, newDueDate } = req.body;
  const delivery = await calendarService.rescheduleDelivery(
    deliveryId,
    new Date(newDueDate)
  );

  req.app.get("io")?.emit("calendar:changed", {
    deliveryId: delivery.id,
    newDate: delivery.dueDate,
  });

  res.json(delivery);
}

export async function getWorkload(req: Request, res: Response) {
  const { from, to } = req.query;
  if (!from || !to) {
    res.status(400).json({ error: "Parametros from y to requeridos" });
    return;
  }
  const data = await calendarService.getWorkloadByPeriod(
    from as string,
    to as string
  );
  res.json(data);
}
