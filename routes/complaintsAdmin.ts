// package and other modules 
import { Router } from "express";

// Controllers (function that get executed on routes)  
import { getComplaintsList, markUnderConsideration, rejectComplaint, resolveComplaint } from "../controllers/complaintsAdmin";
import { ValidateComplaintId, ValidateRejectComplaint } from "../middlewares/ComplaintsValidator";

// Middlewares (to validate requests)  
import { copyQueryParamsToBody, validateAdmin, ValidateUserAuth } from "../middlewares/Validators";

// Initialize router
const ComplaintsAdminRoutes = Router();

// Endpoint for getting all complaints
ComplaintsAdminRoutes.get("/list", copyQueryParamsToBody, ValidateUserAuth, validateAdmin, getComplaintsList);

// endpoint to mark under consideration
ComplaintsAdminRoutes.patch("/mark-under-consideration", ValidateComplaintId, ValidateUserAuth, validateAdmin, markUnderConsideration);

// endpoint to resolve a complaint
ComplaintsAdminRoutes.patch("/resolve", ValidateRejectComplaint, ValidateUserAuth, validateAdmin, resolveComplaint);

// endpoint to reject a complaint
ComplaintsAdminRoutes.patch("/reject", ValidateRejectComplaint, ValidateUserAuth, validateAdmin, rejectComplaint);

// export router
export default ComplaintsAdminRoutes;