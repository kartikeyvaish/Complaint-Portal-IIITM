// Packages imports
import Joi from "joi";
import { batches, complaintDepartments, complaintStatuses, hostels, instituteDepartments, instituteDesignations, roles } from "../config/Constants";

// constants
const MinPasswordLen = 6;
const MaxPasswordLen = 20;

// Email schema to validate a email
export const EmailSchema = Joi.string().email().required().pattern(/@iiitm\.ac\.in$/).messages({
    "any.required": "Email ID is required",
    "string.empty": "Email ID is required",
    "string.email": "Email ID is invalid",
    // Check if email is from iiitm.ac.in domain
    "string.pattern.base": "Email ID should be from IIITM domain",
})

// Password schema to validate a password
export const PasswordSchema = Joi.string()
    .required()
    .messages({
        "any.required": "Password is required",
        "string.empty": "Password is required",
    })

// Phone scheam to validate a phone number
export const PhoneSchema = Joi.string()
    .length(10)
    .pattern(/^[0-9]+$/)
    .required()
    .messages({
        "any.required": "Phone number is required",
        "string.empty": "Phone number is required",
        "string.length": "Phone number should be 10 digits",
        "string.pattern.base": "Phone number should be only digits",
    })

// role schema to validate a role - STUDENT | ADMIN | FACULTY
export const RoleSchema = Joi.string()
    .valid(...roles)
    .required()
    .messages({
        "any.required": "Role is required",
        "string.empty": "Role is required",
        "string.base": "Role must be a string",
        "any.only": `Role must be valid. Any one from - ${roles.join(", ")}`,
    })

// roll number schema to validate roll number. It should req required only for students
export const RollNumberSchema = Joi.when("role", {
    is: Joi.string().valid("STUDENT"),
    then: Joi.string().required().messages({
        "string.base": "Roll number must be a string",
        "string.empty": "Roll number cannot be empty",
        "any.required": "Roll number is required"
    }),
    otherwise: Joi.optional().allow("")
})

// Batch schema to validate batch. It should req required only for students
export const BatchSchema = Joi.when("role", {
    is: Joi.string().valid("STUDENT"),
    then: Joi.string().required().valid(...batches)
        .messages({
            "any.required": "Batch is required",
            "string.empty": "Batch cannot be empty",
            "string.base": "Batch must be a string",
            "any.only": `Batch must be valid. Any one from - ${batches.join(", ")}`,
        }),
    otherwise: Joi.optional().allow("")
})

// Year schema to validate year. It should req required only for students
export const YearSchema = Joi.when("role", {
    is: Joi.string().valid("STUDENT"),
    then: Joi.string().required().messages({
        "string.base": "Year must be a string",
        "string.empty": "Year cannot be empty",
        "any.required": "Year is required"
    }),
    otherwise: Joi.optional().allow("")
})

// Hostel Name schema to validate hostel name. It should req required only for students, staff (if applicable)
export const HostelNameSchema = Joi.when("role", {
    is: Joi.string().valid("STUDENT", "STAFF"),
    then: Joi.string().required().valid(...hostels)
        .messages({
            "any.required": "Hostel name is required",
            "string.empty": "Hostel name cannot be empty",
            "string.base": "Hostel name must be a string",
            "any.only": `Hostel must be valid. Any one from - ${hostels.join(", ")}`,
        }),
    otherwise: Joi.optional().allow("")
})

// Designation schema to validate staff_designation. It should req required only for staff
export const DesignationSchema = Joi.when("role", {
    is: Joi.string().valid("STAFF", "FACULTY"),
    then: Joi.string().required().messages({
        "string.base": "Designation must be a string",
        "string.empty": "Designation cannot be empty",
        "any.required": "Designation is required",
        "any.only": `Designation must be valid. Any one from - ${instituteDesignations.join(", ")}`,
    }),
    otherwise: Joi.optional().allow("")
})

// Department schema to validate department. It should req required only for staff
export const DepartmentSchema = Joi.when("role", {
    is: Joi.string().valid("FACULTY"),
    then: Joi.string().required().messages({
        "string.base": "Department must be a string",
        "string.empty": "Department cannot be empty",
        "any.required": "Department is required",
        "any.only": `Department must be valid. Any one from - ${instituteDepartments.join(", ")}`,
    }),
    otherwise: Joi.optional().allow("")
})

// Room number schema 
export const RoomNumberSchema = Joi.when("role", {
    is: Joi.string().valid("FACULTY", "STUDENT"),
    then: Joi.string().required().messages({
        "string.base": "Room Number name must be a string",
        "string.empty": "Room Number name cannot be empty",
        "any.required": "Room Number name is required"
    }),
    otherwise: Joi.optional().allow("")
})

// Current Password schema to validate a password
export const CurrentPasswordSchema = Joi.string().required().messages({
    "any.required": "Current Password is required",
    "string.empty": "Current Password is required",
})

// New Password schema to validate a password
export const NewPasswordSchema = Joi.string()
    .required()
    .messages({
        "any.required": "New Password is required",
        "string.empty": "New Password is required",
    })

// OTP Id schema
export const OTP_IDSchema = Joi.string().required().messages({
    "any.required": "OTP ID is required",
    "string.empty": "OTP ID is required",
})

// OTP Type schema
export const OTP_TypeSchema = Joi.string().required().messages({
    "any.required": "OTP Type is required",
    "string.empty": "OTP Type is required",
})

// OTP schema
export const OTPSchema = Joi.string().required().messages({
    "any.required": "OTP is required",
    "string.empty": "OTP is required",
})

// Name schema
export const NameSchema = Joi.string().required().messages({
    "any.required": "Name is required",
    "string.empty": "Name is required",
})

// Verified Email ID schema
export const VerifiedEmailIDSchema = Joi.string().allow("").messages({
    "any.required": "Email Verification ID is required",
    "string.empty": "Email Verification ID is required",
})

// Reset ID schema
export const ResetIDSchema = Joi.string().required().messages({
    "any.required": "Reset ID is required",
    "string.empty": "Reset ID is required",
})

// Title Schema
export const TitleSchema = Joi.string().required().messages({
    "any.required": "Title is required",
    "string.empty": "Title is required",
})

// Description Schema
export const DescriptionSchema = Joi.string().required().messages({
    "any.required": "Description is required",
    "string.empty": "Description is required",
})

// Complaint status Schema
export const ComplaintStatusSchema = Joi.string()
    .valid(...complaintStatuses)
    .required()
    .messages({
        "any.required": "Status is required",
        "string.empty": "Status is required",
        "string.base": "Status must be a string",
        "any.only": `Status must be valid. Any one from - ${complaintStatuses.join(", ")}`,
    })

// complaint final statement schema
export const ComplaintFinalStatementSchema = Joi.string().allow("")

// complaint department schema
export const ComplaintDepartmentSchema = Joi.string()
    .valid(...complaintDepartments)
    .required()
    .messages({
        "any.required": "Complaint Department is required",
        "string.empty": "Complaint Department is required",
        "string.base": "Complaint Department must be a string",
        "any.only": `Complaint Department must be valid. Any one from - ${complaintDepartments.join(", ")}`,
    })