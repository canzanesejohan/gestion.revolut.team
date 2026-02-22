import type { Request } from "express";

export interface AuthPayload {
  userId: string;
  role: "ADMIN" | "MANAGER" | "MEMBER";
}

export interface AuthRequest extends Request {
  user?: AuthPayload;
}
