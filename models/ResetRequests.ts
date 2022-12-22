// Packages imports
import mongoose from "mongoose";

// Local imports
import { ResetRequestSchemaInterface } from "../types/SchemaTypes";

// time limit for an OTP
const RESET_TTL = 600; // 10 minutes

// Create Schema
const ResetRequestsSchema = new mongoose.Schema<ResetRequestSchemaInterface>({
    created_at: {
        type: Date,
        default: Date.now,
        required: true,
        expires: RESET_TTL,
    },
    email: {
        type: String,
        required: true,
    }
});

// Create Model
const ResetRequestsModel = mongoose.model("resetrequests", ResetRequestsSchema);

// Exports
export default ResetRequestsModel;