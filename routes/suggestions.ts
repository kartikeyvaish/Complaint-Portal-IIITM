// package and other modules 
import express from "express";

// Controllers (function that get executed on routes)  
import { addSuggestion, getSuggestions } from "../controllers/suggestions";
import { ValidateAddSuggestions } from "../middlewares/SuggestionsValidators";

// Middlewares (to validate requests)  
import { copyQueryParamsToBody, validateAdmin, ValidateUserAuth } from "../middlewares/Validators";

// Initialize router
const SuggestionsRoutes = express.Router();

// Endpoint to get all suggestions from a department
SuggestionsRoutes.get("/", copyQueryParamsToBody, ValidateUserAuth, validateAdmin, getSuggestions);

// Endpoint to add a suggestion
SuggestionsRoutes.post("/", ValidateUserAuth, ValidateAddSuggestions, addSuggestion);

// export router
export default SuggestionsRoutes;