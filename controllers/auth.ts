// Packages imports
import bcrypt from "bcrypt";
import { Request, Response } from "express";

// Models imports   
import ResetRequestsModel from "../models/ResetRequests";
import UserModel from "../models/UserModel";
import VerifiedEmailModel from "../models/VerifiedEmailsModel";

// Helpers 
import { getUserPayload } from "../helpers/auth";
import Messages from "../config/Messages";
import { sendOtp } from "../helpers/otp";
import { instituteBlocks, instituteDepartments } from "../config/Constants";

// function to send otp to a new user
export async function sendNewUserOtp(req: Request, res: Response) {
    try {
        // If user already exists with this email then ask them to Login
        const userObj = await UserModel.findOne({ email: req.body.email });
        if (userObj) return res.status(400).send({
            message: Messages.emailAlreadyInUse,
            email_verified: true,
            acount_exists: true,
            otp_sent: false,
        });

        // If email is already verified then don't send OTP and get all additional details
        const isVerified = await VerifiedEmailModel.findOne({ email: req.body.email });
        if (isVerified) return res.status(400).send({
            message: Messages.emailAlreadyVerified,
            email_verified: true,
            acount_exists: false,
            otp_sent: false,
            verified_id: isVerified._id
        });

        // send an OTP to the user
        const sendOtpObj = await sendOtp("to verify your email", req.body.email, "Email Verification", "signup");
        if (sendOtpObj.ok) {
            return res.status(200).send({
                message: sendOtpObj.message,
                email_verified: false,
                acount_exists: false,
                otp_sent: true,
                otp_id: sendOtpObj.otp_id,
            });
        }

        return res.status(400).send({
            message: Messages.serverError,
            email_verified: false,
            acount_exists: false,
            otp_sent: false,
        });
    } catch (error) {
        // Error Response
        return res.status(500).send({ message: Messages.serverError });
    }
}

// function to execute on login API request
export async function login(req: Request, res: Response) {
    try {
        // check if an account exists with the provided email id
        const userObj = await UserModel.findOne({ email: req.body.email });
        if (!userObj) return res.status(400).json({ message: Messages.accountMissing });

        // check if the password is correct 
        const isPasswordCorrect = bcrypt.compareSync(req.body.password, userObj.password);
        if (!isPasswordCorrect) return res.status(400).json({ message: Messages.invalidCredentials });

        // send otp
        const sendOtpObj = await sendOtp("to verify your email address.", userObj.email, "2FA Socio Login", "login");
        if (!sendOtpObj.ok) return res.status(500).json({ message: sendOtpObj.message });

        return res.status(200).send({
            message: "Login Successful. OTP has been sent to email id. Please verify.",
            otp_id: sendOtpObj.otp_id,
        });
    } catch (error) {
        // Error Response
        return res.status(500).send({ message: Messages.serverError });
    }
}

// function to execute on signup API request
export async function signup(req: Request, res: Response) {
    try {
        // Check if user with same email already exists
        const userObj = await UserModel
            .findOne({ email: req.body.email })

        // If user exists, return error
        if (userObj)
            return res.status(400).send({
                message: Messages.uniqueRegister,
                isLoggedIn: false,
            });

        // department is only for FACULTY
        let block_name = null;
        let department = null;
        if (req.body.role === "FACULTY" && req.body.department) {
            department = req.body.department;

            let findIndex = instituteDepartments.findIndex((department) => department === req.body.department);
            block_name = instituteBlocks[findIndex];
        }

        // designation is only for FACULTY, STAFF
        let designation = null;
        if (req.body.role === "FACULTY" || req.body.role === "STAFF") {
            designation = req.body.designation ? req.body.designation : null;
        }

        // Else create new user instance
        const newUser = new UserModel({
            // Add all compulsory details
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            phone: req.body.phone,
            role: req.body.role,
            hostel_name: req.body.hostel_name ? req.body.hostel_name : null,
            room_number: req.body.room_number ? req.body.room_number : null,

            // For FACULTY, STAFF
            designation: designation,

            // For FACULTY only
            department: department,
            block_name: block_name,

            // For STUDENT only
            ...(req.body.role === "STUDENT" ? {
                roll_number: req.body.roll_number,
                batch: req.body.batch,
                year: req.body.year,
            } : {}),
        });

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        newUser.password = await bcrypt.hash(newUser.password, salt);

        // Save the user
        await newUser.save();

        // Get the user payload
        const userPayload = await getUserPayload(newUser);

        // Return response
        return res.status(200).send({
            ...userPayload,
            message: Messages.accountCreated,
            isLoggedIn: true,
        });
    } catch (error) {
        // Error Response 
        return res.status(500).send({ message: Messages.serverError });
    }
}

// function to change password
export async function changePassword(req: Request, res: Response) {
    try {
        // get the user obj
        const userObj = await UserModel.findById(req.body.user_details._id);
        if (!userObj) return res.status(400).json({ message: Messages.accountMissing });

        // check if the password is correct
        const isPasswordCorrect = bcrypt.compareSync(req.body.current_password, userObj.password);
        if (!isPasswordCorrect) return res.status(400).json({ message: Messages.currentPasswordError });

        // hash the new password
        const salt = await bcrypt.genSalt(10);
        const newPassword = await bcrypt.hash(req.body.new_password, salt);

        // update the password
        userObj.password = newPassword;

        // Save the user
        await userObj.save({ timestamps: false });

        // Return response
        return res.status(200).send({ message: Messages.passwordChanged });
    } catch (error) {
        // Error Response 
        return res.status(500).send({ message: Messages.serverError });
    }
}

// function to send otp for forgot password
export async function forgotPasswordOtp(req: Request, res: Response) {
    try {
        // Check if user exists with the provided email id
        const userObj = await UserModel.findOne({ email: req.body.email });
        if (!userObj) return res.status(400).json({ message: Messages.accountMissing });

        // Send otp
        const sendOtpObj = await sendOtp("to verify your email address.", userObj.email, "Reset Password Request.", "reset");
        if (!sendOtpObj.ok) return res.status(500).json({ message: sendOtpObj.message });

        // Return response
        return res.status(200).send({
            message: "OTP has been sent to email id. Please verify.",
            otp_id: sendOtpObj.otp_id,
        });
    } catch (error) {
        // Error Response 
        return res.status(500).send({ message: Messages.serverError });
    }
}

// Function to reset password
export async function resetPassword(req: Request, res: Response) {
    try {
        // Check if reset request id is valid or not
        const isValidResetObj = await ResetRequestsModel.findById(req.body.reset_id);
        if (!isValidResetObj)
            return res.status(400).json({ message: Messages.invalidResetID });

        // Check if user exists with the provided email id
        const userObj = await UserModel.findOne({ email: req.body.email });
        if (!userObj) return res.status(400).json({ message: Messages.accountMissing });

        // Delete the reset request
        await isValidResetObj.delete();

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.new_password, salt);

        // Update the password
        userObj.password = hashedPassword;

        // Save the user
        await userObj.save({ timestamps: false });

        // Get the user payload
        const userPayload = await getUserPayload(userObj);

        // Return response
        return res.status(200).send({
            ...userPayload,
            message: Messages.passwordReset,
            isLoggedIn: true,
        });
    } catch (error) {
        // Error Response 
        return res.status(500).send({ message: Messages.serverError });
    }
}

// refresh token
export async function refreshToken(req: Request, res: Response) {
    try {
        // Check if user is present or not
        const userObj = await UserModel.findById(req.body.user_id);
        if (!userObj) return res.status(400).json({ message: Messages.accountMissing });

        // Get the user payload
        const userPayload = await getUserPayload(userObj);

        // Return response
        return res.status(200).send({ ...userPayload, message: Messages.tokenRefreshed });
    } catch (error) {
        return res.status(500).send({ message: Messages.serverError });
    }
}
