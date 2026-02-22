import type { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import type { AuthPayload, AuthRequest } from "../types/index.js";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";

export function authenticate(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void {
  const header = req.headers.authorization;

  if (!header?.startsWith("Bearer ")) {
    res.status(401).json({ error: "Token requerido" });
    return;
  }

  const token = header.split(" ")[1];

  try {
    const payload = jwt.verify(token, JWT_SECRET) as AuthPayload;
    req.user = payload;
    next();
  } catch {
    res.status(401).json({ error: "Token inválido o expirado" });
  }
}

export function authorize(...roles: AuthPayload["role"][]) {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ error: "No autenticado" });
      return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({ error: "Sin permisos suficientes" });
      return;
    }

    next();
  };
}
