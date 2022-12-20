// Packages imports
import mongoose from "mongoose";

// Local imports
import { VerifiedEmailSchemaInterface } from "../types/SchemaTypes";

// Create Schema
const VerifiedEmailSchema = new mongoose.Schema<VerifiedEmailSchemaInterface>({
    email: { type: String, required: true, unique: true },
});

// Create Model
const VerifiedEmailModel = mongoose.model("verifiedEmails", VerifiedEmailSchema);

// Exports
export default VerifiedEmailModel;