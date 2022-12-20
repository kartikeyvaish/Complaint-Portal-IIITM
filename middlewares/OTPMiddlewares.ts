// Packages imports 
import { NextFunction, Request, Response } from "express";

// Local imports
import { ChangePasswordSchema, NewUserOTPSchema, ResetPasswordSchema, ValidateOTPSchema } from "../schemas/RequestBodySchemas";
import { validateBody } from "./Validators";

// Function to validate signup otp request
export async function ValidateNewUserSignUp(req: Request, res: Response, next: NextFunction) {
    return validateBody(req, res, next, NewUserOTPSchema);
}

// Function to validate otp payload request
export async function ValidateOTPPayload(req: Request, res: Response, next: NextFunction) {
    return validateBody(req, res, next, ValidateOTPSchema);
}

// Function to validate reset password request
export async function ValidateResetPassword(req: Request, res: Response, next: NextFunction) {
    return validateBody(req, res, next, ResetPasswordSchema);
}

//Function to validate change password request
export async function ValidateChangePassword(req: Request, res: Response, next: NextFunction) {
    return validateBody(req, res, next, ChangePasswordSchema);
}