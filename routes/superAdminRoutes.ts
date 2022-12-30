// package and other modules 
import { Router } from "express";

// Controllers (function that get executed on routes)   
import { assignAdmin, unassignAdmin } from "../controllers/superAdmin";
import { ValidateAssignAdmin } from "../middlewares/SuperAdminValidators";

// Middlewares (to validate requests)  
import { validateSuperAdmin, ValidateUserAuth } from "../middlewares/Validators";

// Initialize router
const SuperAdminRoutes = Router();

// Endpoint to assign a admin role to faculty
SuperAdminRoutes.post("/assign-admin", ValidateAssignAdmin, ValidateUserAuth, validateSuperAdmin, assignAdmin);

// Endpoint to unassign a admin role from faculty
SuperAdminRoutes.patch("/unassign-admin", ValidateAssignAdmin, ValidateUserAuth, validateSuperAdmin, unassignAdmin);

// export router
export default SuperAdminRoutes;