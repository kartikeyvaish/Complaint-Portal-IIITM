// Packages imports 
import { NextFunction, Request, Response } from "express";

// Local imports
import { LoginRequestSchema, SignUpSchema } from "../schemas/RequestBodySchemas";
import { isValidStudentEmail } from "../helpers/helpers";
import { validateBody } from "./Validators";
import Messages from "../config/Messages";
import VerifiedEmailModel from "../models/VerifiedEmailsModel";

// Function to validate login request
export function ValidateLogin(req: Request, res: Response, next: NextFunction) {
    return validateBody(req, res, next, LoginRequestSchema);
}

// Function to validate signup request
export function ValidateSignUp(req: Request, res: Response, next: NextFunction) {
    return validateBody(req, res, next, SignUpSchema);
}

// Function to Check if role is STUDENT then check if its a valid student email
export async function ValidateEmail(req: Request, res: Response, next: NextFunction) {
    // Check if verified_id is valid or not
    const isValidEmailObj = await VerifiedEmailModel.findById(req.body.verified_id);
    if (!isValidEmailObj)
        return res.status(400).json({ message: Messages.emailNotVerified });

    req.body.email = isValidEmailObj.email;

    if (req.body.role === "STUDENT") {
        if (isValidStudentEmail(req.body.email)) {
            return next();
        } else {
            return res.status(400).send({ message: Messages.invalidStudentEmail });
        }
    }

    next();
}
