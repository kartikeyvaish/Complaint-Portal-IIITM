// Packages imports
import mongoose from "mongoose";

// Local imports
import { RefreshTokenSchemaInterface } from "../types/SchemaTypes";

// time limit for an Refresh Token to be valid (7 days)
const ExpiryLimit = 604800;

// Create Schema
const RefreshTokenModelSchema = new mongoose.Schema<RefreshTokenSchemaInterface>({
    created_at: {
        type: Date,
        default: Date.now,
        required: true,
        expires: ExpiryLimit,
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
    }
});

// Create Model
const RefreshTokenModel = mongoose.model("refreshToken", RefreshTokenModelSchema);

// Exports
export default RefreshTokenModel;