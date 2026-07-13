import { Request, Response, NextFunction } from "express";
import {
  UnauthorizedError,
  ExpressMiddlewareInterface,
} from "routing-controllers";
import jwt from "jsonwebtoken";

export interface JwtPayload {
  userId: string;
}

const SECRET_KEY = process.env.SECRET_KEY as string;

export class AuthMiddleware implements ExpressMiddlewareInterface {
  use(req: Request, res: Response, next: NextFunction) {
    const header = req.headers.authorization;
    if (!header) {
      throw new UnauthorizedError("no header");
    }

    const token = header.split(" ")[1];

    if (!token) {
      throw new UnauthorizedError("no valid token provided");
    }

    let decoded: JwtPayload;
    try {
      decoded = jwt.verify(token, SECRET_KEY) as JwtPayload;
    } catch (error) {
      throw new UnauthorizedError("Invalid or expired token");
    }

    (req as any).user = decoded;

    next();
  }
}
