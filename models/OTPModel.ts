// Packages imports
import mongoose from "mongoose";

// Local imports
import { OTPSchemaInterface } from "../types/SchemaTypes";

// time limit for an OTP
const OTP_TIME_LIMIT = 600; // 10 minutes

// Create Schema
const OTPModelSchema = new mongoose.Schema<OTPSchemaInterface>({
    verification_type: {
        type: String,
        required: true,
    },
    created_at: {
        type: Date,
        default: Date.now,
        required: true,
        expires: OTP_TIME_LIMIT,
    },
    otp: {
        type: String,
        required: true,
    },
    email: {
        type: String,
    }
});

// Create Model
const OTPModel = mongoose.model("otp", OTPModelSchema);

// Exports
export default OTPModel;