// Packages imports 
import { NextFunction, Request, Response } from "express";

// Local imports 
import { ComplaintIDBodySchema, DeleteCommentSchema, EditComplaintSchema, NewCommentSchema, NewComplaintSchema, RejectComplaintSchema } from "../schemas/RequestBodySchemas";
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

// Function to validate a new comment request
export function ValidateNewComment(req: Request, res: Response, next: NextFunction) {
    return validateBody(req, res, next, NewCommentSchema);
}

// Function to validate deleting a comment request
export function ValidateDeleteComment(req: Request, res: Response, next: NextFunction) {
    return validateBody(req, res, next, DeleteCommentSchema);
}

// function to validate resolve/reject request
export function ValidateRejectComplaint(req: Request, res: Response, next: NextFunction) {
    return validateBody(req, res, next, RejectComplaintSchema);
} 