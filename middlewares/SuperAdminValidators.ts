// Packages imports 
import { NextFunction, Request, Response } from "express";

// Local imports
import { AssignAdminSchema, UnassignAdminSchema } from "../schemas/RequestBodySchemas";
import { validateBody } from "./Validators";

// Function to validate assign admin request body
export async function ValidateAssignAdmin(req: Request, res: Response, next: NextFunction) {
    return validateBody(req, res, next, AssignAdminSchema);
}

// Function to validate unassign admin request body
export async function ValidateUnassignAdmin(req: Request, res: Response, next: NextFunction) {
    return validateBody(req, res, next, UnassignAdminSchema);
}