// Packages imports 
import { NextFunction, Request, Response } from "express";

// Local imports
import { AddSuggestionSchema } from "../schemas/RequestBodySchemas";
import { validateBody } from "./Validators";

// Function to validate adding suggestion requests
export async function ValidateAddSuggestions(req: Request, res: Response, next: NextFunction) {
    return validateBody(req, res, next, AddSuggestionSchema);
}