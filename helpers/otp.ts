// Packages imports
import bcrypt from 'bcrypt';

// Models imports
import OTPModel from "../models/OTPModel";

// Configs and other helpers imports
import Messages from "../config/Messages";
import { SendOTPEmail } from "../utils/Mailer";

// function to send otp to a user
export async function sendOtp(reason: string, email: string, subject: string, otp_type: string) {
    try {
        // Generate a random 6 digit otp
        // const randomNumber = Math.floor(100000 + Math.random() * 900000).toString();
        const randomNumber = "123456";

        // create a new otp object
        const newOtp = new OTPModel({
            email: email,
            otp: randomNumber,
            verification_type: otp_type,
        })

        // Hash the otp
        const salt = await bcrypt.genSalt(10);
        newOtp.otp = await bcrypt.hash(randomNumber, salt);

        // Save the OTP instance
        await newOtp.save();

        // Send Email
        // const sendMail = await SendOTPEmail({
        //     to: email,
        //     subject: subject,
        //     locals: {
        //         OTP: randomNumber,
        //         operation: reason,
        //     },
        // });

        // if (sendMail.ok)
        //     return { message: Messages.otpSent, ok: true, otp_id: newOtp._id, otp: randomNumber };

        // await newOtp.delete();

        // return { message: Messages.serverError, ok: false };

        return { message: Messages.otpSent, ok: true, otp_id: newOtp._id, otp: randomNumber };
    } catch (error) {
        return { message: Messages.serverError, ok: false };
    }
}