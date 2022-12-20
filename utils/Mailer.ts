// Packages imports
import Email from "email-templates";
import nodemailer from "nodemailer";

// Local imports
import Messages from "../config/Messages";

// create a transporter object
let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.google_admin_email,
        pass: process.env.google_app_password,
    },
});

// create a mailer object
const Mailer = new Email({
    transport: transporter,
    preview: false,
    send: true,
});

export async function SendOTPEmail({ to = "", subject = "", locals = {} }) {
    try {
        const response = await Mailer.send({
            template: "OTP",
            message: {
                to: to,
                from: `Complaint Portal IIITM <${process.env.google_admin_email}>`,
                subject: subject,
            },
            locals: locals,
        });

        return { response: "Email Sent Successfully", ok: true, data: response };
    } catch (error) {
        return { response: Messages.serverError, ok: false };
    }
} 
