// package and other modules 
import express from "express";

// Controllers (function that get executed on routes) 
import { validateForgotPasswordOtp, validateLoginOtp, validateSignUpOtp } from "../controllers/otp";

// Middlewares (to validate requests) 
import { ValidateOTPPayload } from "../middlewares/OTPMiddlewares";

// Initialize router
const OTPRoutes = express.Router();

// Verify otp while signing up using email address
OTPRoutes.post("/validate-signup-otp", ValidateOTPPayload, validateSignUpOtp);

// verify 2fa otp while logging in
OTPRoutes.post("/validate-login-otp", ValidateOTPPayload, validateLoginOtp);

// verify forgot password otp
OTPRoutes.post("/validate-forgot-password-otp", ValidateOTPPayload, validateForgotPasswordOtp);

// export router
export default OTPRoutes;