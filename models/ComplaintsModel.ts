// Packages imports
import mongoose from "mongoose";

// Local imports
import { complaintDepartments, complaintStatuses } from "../config/Constants";
import { ComplaintCommentSchema, ComplaintsSchemaInterface, FileProps } from "../types/SchemaTypes";

// File attatchments schema
const FilePropsSchema = new mongoose.Schema<FileProps>({
    datetime: Date,
    mimeType: String,
    public_id: String,
    uri: String,
    duration: Number,
    height: Number,
    width: Number,
});

// Comment schema
const CommentSchema = new mongoose.Schema<ComplaintCommentSchema>({
    comment: {
        type: String,
        required: true,
    },
    commented_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });

// Create Schema
const ComplaintModelSchema = new mongoose.Schema<ComplaintsSchemaInterface>({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    posted_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
    },
    status: {
        type: String,
        required: true,
        enum: complaintStatuses,
        default: "PENDING REVIEW"
    },
    comments: {
        type: [CommentSchema],
        default: [],
    },
    final_statement: {
        type: String,
        default: "",
    },
    complaint_department: {
        type: String,
        required: true,
        enum: complaintDepartments,
    },
    complaint_attatchments: {
        type: [FilePropsSchema],
        default: [],
    },
    resolved_attatchments: {
        type: [FilePropsSchema],
        default: [],
    },
}, { timestamps: true });

// Create Model
const ComplaintsModel = mongoose.model("complaints", ComplaintModelSchema);

// Exports
export default ComplaintsModel;