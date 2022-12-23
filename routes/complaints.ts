// package and other modules 
import { Router } from "express";

// Controllers (function that get executed on routes)  
import { createComplaint, editComplaint, getComplaintDetails, getComplaintsList, getOwnComplaints, markUnderConsideration } from "../controllers/complaints";
import { ValidateComplaintId, ValidateEditComplaint, ValidateNewComplaint } from "../middlewares/ComplaintsValidator";

// Middlewares (to validate requests)  
import { copyQueryParamsToBody, validateAdmin, ValidateUserAuth } from "../middlewares/Validators";

// Initialize router
const ComplaintsRoutes = Router();

// Endpoint for getting all complaints
ComplaintsRoutes.get("/list", copyQueryParamsToBody, ValidateUserAuth, validateAdmin, getComplaintsList);

// Endpoint for getting details of a complaint
ComplaintsRoutes.get("/details", copyQueryParamsToBody, ValidateComplaintId, ValidateUserAuth, getComplaintDetails);

// Endpoint to get complaints posted by the user
ComplaintsRoutes.get("/own", copyQueryParamsToBody, ValidateUserAuth, getOwnComplaints);

// Endpoint for creating a new complaint
ComplaintsRoutes.post("/create", ValidateNewComplaint, ValidateUserAuth, createComplaint);

// Endpoint for editing a complaint
ComplaintsRoutes.patch("/edit", ValidateEditComplaint, ValidateUserAuth, editComplaint);

// endpoint to mark under consideration
ComplaintsRoutes.patch("/mark-under-consideration", ValidateComplaintId, ValidateUserAuth, validateAdmin, markUnderConsideration);

// export router
export default ComplaintsRoutes;