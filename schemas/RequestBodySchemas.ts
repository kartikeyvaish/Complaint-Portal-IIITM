// Packages imports
import Joi from 'joi';

// Local imports
import {
    BatchSchema, CurrentPasswordSchema, EmailSchema, HostelNameSchema, NameSchema, NewPasswordSchema, OTPSchema, OTP_IDSchema,
    OTP_TypeSchema, PasswordSchema, PhoneSchema, ResetIDSchema, RoleSchema, RollNumberSchema, RoomNumberSchema, VerifiedEmailIDSchema, YearSchema,
    TitleSchema, DescriptionSchema, DepartmentSchema, DesignationSchema, ComplaintDepartmentSchema
} from './JoiSchemas';

// Login Schema to validate the request body for Login API
export const LoginRequestSchema = Joi.object({
    email: EmailSchema,
    password: PasswordSchema,
}).options({ stripUnknown: true });

// function to validate the request body for sending OTP
export const NewUserOTPSchema = Joi.object({
    email: EmailSchema,
}).options({ stripUnknown: true });

// function to validate the request body for validating OTP
export const ValidateOTPSchema = Joi.object({
    otp_id: OTP_IDSchema,
    email: EmailSchema,
    otp_type: OTP_TypeSchema,
    otp: OTPSchema,
}).options({ stripUnknown: true });

// Signup Schema to validate the request body for Signup API
export const SignUpSchema = Joi.object({
    // compulsory fields
    name: NameSchema,
    password: PasswordSchema,
    phone: PhoneSchema,
    role: RoleSchema,
    room_number: RoomNumberSchema,

    // Based on student role
    roll_number: RollNumberSchema,
    batch: BatchSchema,
    year: YearSchema,

    // based on staff, student role
    hostel_name: HostelNameSchema,

    // based on faculty, staff role
    department: DepartmentSchema,
    designation: DesignationSchema,

    // db props
    verified_id: VerifiedEmailIDSchema,
}).options({ stripUnknown: true });

// schema to validate reset password request
export const ResetPasswordSchema = Joi.object({
    email: EmailSchema,
    new_password: PasswordSchema,
    reset_id: ResetIDSchema,
}).options({ stripUnknown: true });

// Schema to validate change password requests
export const ChangePasswordSchema = Joi.object({
    current_password: CurrentPasswordSchema,
    new_password: NewPasswordSchema,
}).options({ stripUnknown: true });

// Schema to validate new complaint posting requests
export const NewComplaintSchema = Joi.object({
    title: TitleSchema,
    description: DescriptionSchema,
    complaint_department: ComplaintDepartmentSchema,
}).options({ stripUnknown: true });