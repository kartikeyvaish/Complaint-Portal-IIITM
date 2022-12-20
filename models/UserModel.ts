// Packages imports
import mongoose from "mongoose";

// Local imports
import { batches, hostels, roles } from "../config/Constants";
import { UserSchemaInterface } from "../types/SchemaTypes";

// Create Schema
const UserModelSchema = new mongoose.Schema<UserSchemaInterface>({
    // Required Fields
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: {
        type: String,
        required: true,
        length: 10,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        required: true,
        enum: roles,
    },
    room_number: {
        type: String,
        default: null,
    },

    // Fields based on role : If role is student, then roll_number, batch, year are required otherwise null
    roll_number: {
        type: String,
        default: null
    },
    batch: {
        type: String,
        default: null,
        enum: batches
    },
    year: {
        type: String,
        default: null,
    },

    // if role is STUDENT, STAFF then hostel_name is required otherwise null
    hostel_name: {
        type: String,
        default: null,
        enum: hostels
    },

    // Fields based on role : If role is FACULTY, then block_name is required otherwise null
    block_name: {
        type: String,
        default: null
    },
    department: {
        type: String,
        default: null
    },

    // Fields based on role : If role is STAFF, FACULTY, then department, designation are required otherwise null
    designation: {
        type: String,
        default: null
    },

    // Fields based on role : If role is ADMIN, then admin_department is required otherwise null
    admin_department: {
        type: String,
        default: null
    },
}, { timestamps: true });

// Create Model
const UserModel = mongoose.model("users", UserModelSchema);

// Exports
export default UserModel;