// Packages imports
import { Types } from "mongoose";

// Local imports
import { batches, complaintDepartments, complaintStatuses, hostels, roles } from "../config/Constants";

// interface for ComplaintCommentSchema
export interface ComplaintCommentSchema {
    comment: string;
    commented_by: Types.ObjectId;
    isDeleted: boolean;
}

// interface for ComplaintsSchema
export interface ComplaintsSchemaInterface {
    title: string;
    description: string;
    location: string;
    posted_by: Types.ObjectId;
    status: typeof complaintStatuses[number];
    comments: ComplaintCommentSchema[];
    final_statement: string;
    complaint_department: typeof complaintDepartments[number];

    // attatchments
    complaint_attatchments: FileProps[];
    resolved_attatchments: FileProps[];
}

// interface for UsersSchema
export interface UserSchemaInterface {
    // Compulsory Fields
    name: string;
    email: string;
    password: string;
    phone: string;
    room_number: string | null;
    role: typeof roles[number];
    initial_role: typeof roles[number];

    // if role is STUDENT
    roll_number: string | null;
    year: string | null;
    batch: typeof batches[number];
    hostel_name: typeof hostels[number];

    // if role is FACULTY or STAFF
    block_name: string;
    designation: string;
    department: string;

    // if role is ADMIN
    admin_department: string;

    // MongoDB Fields
    account_created_at: Date;
    last_updated_at: Date;
}

// interface for FileProps
export interface FileProps {
    public_id: string;
    uri: string;
    mimeType: string;
    datetime: Date;
    duration?: number;
    width?: number;
    height?: number;
}

// interface for OTPSchema
export interface OTPSchemaInterface {
    otp: string;
    verification_type: string;
    created_at: Date;
    email: string;
}

// interface for Verified email
export interface VerifiedEmailSchemaInterface {
    email: string;
}

// interface for ResetRequests
export interface ResetRequestSchemaInterface {
    created_at: Date;
    email: string;
}

// interface for RefreshTokens
export interface RefreshTokenSchemaInterface {
    created_at: Date;
    user_id: Types.ObjectId;
}

// interface for Suggestions
export interface SuggestionsInterface {
    department: typeof complaintDepartments[number];
    posted_by: Types.ObjectId;
    description: string;
    is_anonymous: boolean;
}