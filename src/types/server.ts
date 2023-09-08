import type { Request, Response, NextFunction } from "express";

export type PreRouteMiddleware = (req: Request, res: Response, next: NextFunction) => void;
