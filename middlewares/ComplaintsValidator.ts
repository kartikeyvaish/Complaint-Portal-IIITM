// Packages imports 
import { NextFunction, Request, Response } from "express";

// Local imports 
import { NewComplaintSchema } from "../schemas/RequestBodySchemas";
import { validateBody } from "./Validators";

// Function to validate signup otp request
export function ValidateNewComplaint(req: Request, res: Response, next: NextFunction) {
    return validateBody(req, res, next, NewComplaintSchema);
} 