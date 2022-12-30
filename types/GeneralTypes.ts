// Packages imports
import mongoose, { LeanDocument, Types } from "mongoose";

// Local imports
import { ComplaintsSchemaInterface, UserSchemaInterface } from "./SchemaTypes";
import lodash from 'lodash';

// interface for isComplainValid function
export interface validComplaintResponse {
    valid_complain: boolean,
    message: string | null,
    complaintObj: mongoose.Document<unknown, any, ComplaintsSchemaInterface> & ComplaintsSchemaInterface & {
        _id: mongoose.Types.ObjectId;
    }
}

// interface for userDetails object in the request body
export interface UserDetailsProps extends lodash.Omit<LeanDocument<UserSchemaInterface> & {
    _id: Types.ObjectId;
}, "password"> { }