// package and other modules 
import { Router } from "express";

// Controllers (function that get executed on routes)  
import { createComplaint, getComplaints } from "../controllers/complaints";
import { ValidateNewComplaint } from "../middlewares/ComplaintsValidator";

// Middlewares (to validate requests)  
import { ValidateUserAuth } from "../middlewares/Validators";

// Initialize router
const ComplaintsRoutes = Router();

// Endpoint for getting all complaints
ComplaintsRoutes.get("/", ValidateUserAuth, getComplaints);

// Endpoint for creating a new complaint
ComplaintsRoutes.post("/create", ValidateUserAuth, ValidateNewComplaint, createComplaint);

// export router
export default ComplaintsRoutes;