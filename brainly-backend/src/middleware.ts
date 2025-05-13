import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';

dotenv.config(); 

export const userMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const header = req.headers["authorization"];

    if (!header) {
        return res.status(401).json({ msg: "Authorization header missing" });
    }

    const token = header.split(" ")[1]; 

    try {
        const decode = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string };
        //@ts-ignore
        req.userId = decode.id;  
        next();
    } catch (error) {
        return res.status(403).json({ msg: "Invalid token or expired session" });
    }
};
