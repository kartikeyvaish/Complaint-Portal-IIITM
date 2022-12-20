// Packages imports 
import bcrypt from 'bcrypt';
import { Request, Response } from "express";

// Models imports  
import OTPModel from "../models/OTPModel";
import ResetRequestsModel from '../models/ResetRequests';
import UserModel from "../models/UserModel";
import VerifiedEmailModel from "../models/VerifiedEmailsModel";

// Helpers 
import Messages from "../config/Messages";
import { getUserPayload } from '../helpers/auth';

// function to validate signup otp
export async function validateSignUpOtp(req: Request, res: Response) {
    try {
        // check if otp with this otp_id exists or not
        const otpObj = await OTPModel.findById(req.body.otp_id);
        if (!otpObj) return res.status(400).json({ message: Messages.otpExpired });

        // check if verification type and email with which otp is generated is correct or not
        if (otpObj.verification_type !== req.body.otp_type || otpObj.email !== req.body.email)
            return res.status(400).json({ message: Messages.invalidOtp });

        // check if otp is correct or not 
        const isOtpCorrect = bcrypt.compareSync(req.body.otp, otpObj.otp);
        if (!isOtpCorrect) return res.status(400).json({ message: Messages.invalidOtp });

        // All set, then delete otp from database
        await otpObj.delete();

        // add this email to verified emails collection only if it is not already present 
        const verifiedEmailObj = await VerifiedEmailModel.findOne({ email: req.body.email });

        if (verifiedEmailObj) {
            return res.status(200).json({ message: Messages.otpVerified, verified_id: verifiedEmailObj._id });
        } else {
            const newVerifiedEmailObj = new VerifiedEmailModel({ email: req.body.email });
            await newVerifiedEmailObj.save();
            return res.status(200).json({ message: Messages.otpVerified, verified_id: newVerifiedEmailObj._id });
        }
    } catch (error) {
        // Error Response
        return res.status(500).send({ message: Messages.serverError, isLoggedIn: false });
    }
}

// function to validate login otp
export async function validateLoginOtp(req: Request, res: Response) {
    try {
        // check if otp with this otp_id exists or not
        const otpObj = await OTPModel.findById(req.body.otp_id);
        if (!otpObj) return res.status(400).json({ message: Messages.otpExpired });

        // check if verification type and email with which otp is generated is correct or not
        if (otpObj.verification_type !== req.body.otp_type || otpObj.email !== req.body.email)
            return res.status(400).json({ message: Messages.invalidOtp });

        // check if otp is correct or not
        const isOtpCorrect = bcrypt.compareSync(req.body.otp, otpObj.otp);
        if (!isOtpCorrect) return res.status(400).json({ message: Messages.invalidOtp });

        // All set, then delete otp from database
        await otpObj.delete();

        const userObj = await UserModel.findOne({ email: req.body.email });
        if (!userObj) return res.status(400).json({ message: Messages.accountMissing });

        // Get the user payload
        const userPayload = await getUserPayload(userObj);

        // Return response
        return res.status(200).send({
            ...userPayload,
            message: Messages.loggedIn,
            isLoggedIn: true,
        });
    } catch (error) {
        // Error Response
        return res.status(500).send({ message: Messages.serverError, isLoggedIn: false });
    }
}

// Function to validate forgot password otp
export async function validateForgotPasswordOtp(req: Request, res: Response) {
    try {
        // check if otp with this otp_id exists or not
        const otpObj = await OTPModel.findById(req.body.otp_id);
        if (!otpObj) return res.status(400).json({ message: Messages.otpExpired });

        // check if verification type and email with which otp is generated is correct or not
        if (otpObj.verification_type !== req.body.otp_type || otpObj.email !== req.body.email)
            return res.status(400).json({ message: Messages.invalidOtp });

        // check if otp is correct or not
        const isOtpCorrect = bcrypt.compareSync(req.body.otp, otpObj.otp);
        if (!isOtpCorrect) return res.status(400).json({ message: Messages.invalidOtp });

        // All set, then delete otp from database
        await otpObj.delete();

        // Create a reset request
        const resetRequest = new ResetRequestsModel();

        // Save the reset request
        await resetRequest.save();

        // return response
        return res.status(200).send({ message: Messages.otpVerified, reset_id: resetRequest._id });
    } catch (error) {
        // Error Response
        return res.status(500).send({ message: Messages.serverError, isLoggedIn: false });
    }
}