// Packages imports 
import { NextFunction, Request, Response } from "express";

// Local imports 
import { ComplaintIDBodySchema, EditComplaintSchema, NewComplaintSchema } from "../schemas/RequestBodySchemas";
import { validateBody } from "./Validators";

// Function to validate signup otp request
export function ValidateNewComplaint(req: Request, res: Response, next: NextFunction) {
    return validateBody(req, res, next, NewComplaintSchema);
}

// Function to validate complaint id
export function ValidateComplaintId(req: Request, res: Response, next: NextFunction) {
    return validateBody(req, res, next, ComplaintIDBodySchema);
}

// Function to validate edit request
export function ValidateEditComplaint(req: Request, res: Response, next: NextFunction) {
    return validateBody(req, res, next, EditComplaintSchema);
}