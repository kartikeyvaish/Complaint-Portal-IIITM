// Packages imports
import Joi from 'joi';

// Local imports
import {
    BatchSchema, CurrentPasswordSchema, EmailSchema, HostelNameSchema, NameSchema, NewPasswordSchema, OTPSchema, OTP_IDSchema,
    OTP_TypeSchema, PasswordSchema, PhoneSchema, ResetIDSchema, RoleSchema, RollNumberSchema, RoomNumberSchema, VerifiedEmailIDSchema, YearSchema,
    TitleSchema, DescriptionSchema, DepartmentSchema, DesignationSchema, ComplaintDepartmentSchema, ComplaintIDSchema, ComplaintFinalStatementSchema, ComplaintDepartmentSchemaEditable, UserIDSchema, IsAnonymousSchema, AdminDepartmentSchema
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

// Schema to validate complaint_id
export const ComplaintIDBodySchema = Joi.object({
    complaint_id: ComplaintIDSchema,
}).options({ stripUnknown: true });

// Schema to vaalidate new comment
export const NewCommentSchema = Joi.object({
    complaint_id: ComplaintIDSchema,
    comment: Joi.string().required(),
}).options({ stripUnknown: true });

// Schema to validate deleting a comment
export const DeleteCommentSchema = Joi.object({
    complaint_id: ComplaintIDSchema,
    comment_id: Joi.string().required(),
}).options({ stripUnknown: true });

// Schema to validate edit complaint requests
export const EditComplaintSchema = Joi.object({
    complaint_id: ComplaintIDSchema,
    title: Joi.string(),
    description: Joi.string(),
    complaint_department: ComplaintDepartmentSchemaEditable,
}).options({ stripUnknown: true });

// Schema to validate resolve/reject complaint requests
export const RejectComplaintSchema = Joi.object({
    complaint_id: ComplaintIDSchema,
    final_statement: ComplaintFinalStatementSchema,
}).options({ stripUnknown: true });

// Schema to validate assign/unassign admin role
export const AssignAdminSchema = Joi.object({
    user_id: UserIDSchema,
    admin_department: AdminDepartmentSchema,
}).options({ stripUnknown: true });

// Schema to unassign admin role
export const UnassignAdminSchema = Joi.object({
    user_id: UserIDSchema,
}).options({ stripUnknown: true });

// Schema to validate adding suggestion requests
export const AddSuggestionSchema = Joi.object({
    department: ComplaintDepartmentSchema,
    description: DescriptionSchema,
    is_anonymous: IsAnonymousSchema,
}).options({ stripUnknown: true });