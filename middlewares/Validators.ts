// Packages imports 
import { NextFunction, Request, Response } from "express";
import Joi from "joi";

// Model Imports
import UserModel from "../models/UserModel";

// Local imports
import Messages from "../config/Messages";
import { isValidObjectId } from "../helpers/auth";
import { access_token_validator, refresh_token_validator } from "../helpers/jwt";
import RefreshTokenModel from "../models/RefreshTokensModel";

// Function to validate a request body based on a Joi schema
export function validateBody(req: Request, res: Response, next: NextFunction, schema: Joi.ObjectSchema<any>) {
    try {
        // check for fields
        const result = schema.validate(req.body);

        if (result.error)
            return res.status(400).send({ message: result.error.details[0].message });

        // if no error then call the next function
        next();
    } catch (error) {
        return res.status(500).send({ message: Messages.serverError });
    }
}

// function to check if refreshToken is valid or not
export const ValidateRefreshToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authToken = req.headers?.authorization;

        // Check if auth has been provided or not.
        if (!authToken)
            return res.status(400).send({ message: Messages.tokenMissing });

        // Check if the token is valid or not.
        if (typeof authToken !== "string")
            return res.status(400).send({ message: Messages.tokenMissing });

        // Split the bearer
        let result = authToken.split(" ");

        // Check if bearer is valid or not
        if (result.length !== 2)
            return res.status(400).send({ message: Messages.tokenMissing });

        // Check access token expiry
        const { ok, decoded }: any = await refresh_token_validator(result[1]);

        // If its expired then return error
        if (!ok) return res.status(401).send({ message: Messages.unauthorized, refresh_token_expired: true });

        // Check if a refresh token with _id exists or not
        const refreshTokenObj = await RefreshTokenModel.findById(decoded._id);
        if (!refreshTokenObj)
            return res.status(401).send({ message: Messages.unauthorized, refresh_token_expired: true });

        req.body.user_id = refreshTokenObj.user_id.toString();

        // Delete the refresh token from the database
        await refreshTokenObj.delete();

        // Proceed to next middleware
        next();
    } catch (error) {
        return res.status(500).send({ message: "Token Authentication Failed" });
    }
}

// function to check if the request has user authorization
export const ValidateUserAuth = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authToken = req.headers?.authorization;

        // Check if auth has been provided or not.
        if (!authToken)
            return res.status(400).send({ message: Messages.tokenMissing });

        // Check if the token is valid or not.
        if (typeof authToken !== "string")
            return res.status(400).send({ message: Messages.tokenMissing });

        // Split the bearer
        let result = authToken.split(" ");

        // Check if bearer is valid or not
        if (result.length !== 2)
            return res.status(400).send({ message: Messages.tokenMissing });

        // Check access token expiry
        const Token: any = await access_token_validator(result[1]);

        // If its expired then return error
        if (!Token.ok)
            return res.status(400).send({ message: Messages.tokenExpired, access_token_expired: true });

        // Check if the user id is valid or not
        const validity = isValidObjectId(Token.decoded._id)
        if (!validity) return res.status(400).send({ message: Messages.invalidUserId });

        // Find the user
        const user = await UserModel.findById(Token.decoded._id);

        // If user is not found then return error
        if (!user)
            return res.status(400).send({ message: Messages.accountMissing });

        // If user is found then set the user in the request
        req.body.user_details = {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            admin_department: user.admin_department,
        };

        // Proceed to next middleware
        next();
    } catch (error) {
        return res.status(500).send({ message: "Token Authentication Failed" });
    }
};

// function to check whether the user is present in the database or not
export async function validateUser(req: Request, res: Response, next: NextFunction) {
    // Check if user exists with the provided email id
    const userObj = await UserModel.findOne({ email: req.body.email });
    if (!userObj) return res.status(404).json({ message: Messages.accountMissing });

    next();
}

// function to check if the user is admin or not
export async function validateAdmin(req: Request, res: Response, next: NextFunction) {
    if (req.body.user_details.role !== "ADMIN")
        return res.status(403).json({ message: Messages.unAuthorizedRequest });

    next();
}

// function to copy all queries, params to req.body
export const copyQueryParamsToBody = (req: Request, res: Response, next: NextFunction) => {
    req.body = { ...req.body, ...req.query, ...req.params };
    next();
}