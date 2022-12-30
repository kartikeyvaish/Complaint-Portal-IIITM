// package and other modules 
import { Router } from "express";

// Controllers (function that get executed on routes)
import { changePassword, forgotPasswordOtp, getProfile, login, logout, refreshToken, resetPassword, sendNewUserOtp, signup } from "../controllers/auth";

// Middlewares (to validate requests)
import { ValidateLogin, ValidateSignUp, ValidateEmail, } from "../middlewares/AuthValidators";
import { ValidateChangePassword, ValidateNewUserSignUp, ValidateResetPassword } from "../middlewares/OTPMiddlewares";
import { ValidateRefreshToken, validateUser, ValidateUserAuth } from "../middlewares/Validators";

// Initialize router
const AuthRoutes = Router();

// Send otp while signing up using email address
AuthRoutes.post("/send-signup-otp", ValidateNewUserSignUp, sendNewUserOtp);

// Endpoint for Signup
AuthRoutes.post("/signup", ValidateSignUp, ValidateEmail, signup);

// Endpoint for Login
AuthRoutes.post("/login", ValidateLogin, login);

// Endpoint for logout
AuthRoutes.delete("/logout", ValidateUserAuth, logout);

// EndPoint for Forgot Password 
AuthRoutes.post("/forgot-password", ValidateNewUserSignUp, validateUser, forgotPasswordOtp);

// Endpoint for Reset password
AuthRoutes.post("/reset-password", ValidateResetPassword, resetPassword);

// Endpoint for Changing password
AuthRoutes.put("/change-password", ValidateUserAuth, ValidateChangePassword, changePassword);

// Endpoint for getting profile details
AuthRoutes.get("/profile", ValidateUserAuth, getProfile)

// Endpoint for Refreshing Token
AuthRoutes.post("/refresh-token", ValidateRefreshToken, refreshToken);

// export router
export default AuthRoutes;