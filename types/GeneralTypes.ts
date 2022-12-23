// Packages imports
import mongoose from "mongoose";

// Local imports
import { ComplaintsSchemaInterface } from "./SchemaTypes";

// interface for isComplainValid function
export interface validComplaintResponse {
    valid_complain: boolean,
    message: string | null,
    complaintObj: mongoose.Document<unknown, any, ComplaintsSchemaInterface> & ComplaintsSchemaInterface & {
        _id: mongoose.Types.ObjectId;
    }
}