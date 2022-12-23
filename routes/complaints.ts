// package and other modules 
import { Router } from "express";

// Controllers (function that get executed on routes)  
import { addComment, createComplaint, deleteComment, editComplaint, getComplaintDetails, getOwnComplaints, } from "../controllers/complaints";
import { ValidateComplaintId, ValidateDeleteComment, ValidateEditComplaint, ValidateNewComment, ValidateNewComplaint, } from "../middlewares/ComplaintsValidator";

// Middlewares (to validate requests)  
import { copyQueryParamsToBody, ValidateUserAuth } from "../middlewares/Validators";

// Initialize router
const ComplaintsRoutes = Router();

// Endpoint for getting details of a complaint
ComplaintsRoutes.get("/details", copyQueryParamsToBody, ValidateComplaintId, ValidateUserAuth, getComplaintDetails);

// Endpoint to get complaints posted by the user
ComplaintsRoutes.get("/own", copyQueryParamsToBody, ValidateUserAuth, getOwnComplaints);

// Endpoint for creating a new complaint
ComplaintsRoutes.post("/create", ValidateNewComplaint, ValidateUserAuth, createComplaint);

// Endpoint for editing a complaint
ComplaintsRoutes.patch("/edit", ValidateEditComplaint, ValidateUserAuth, editComplaint);

// endpoint to add a comment to a complaint
ComplaintsRoutes.post("/add-comment", ValidateNewComment, ValidateUserAuth, addComment);

// endpoint to delete a comment from a complaint
ComplaintsRoutes.delete("/delete-comment", ValidateDeleteComment, ValidateUserAuth, deleteComment);

// export router
export default ComplaintsRoutes;