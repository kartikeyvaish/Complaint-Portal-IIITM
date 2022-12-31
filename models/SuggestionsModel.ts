// Packages imports
import mongoose from "mongoose";

// Local imports
import { SuggestionsInterface } from "../types/SchemaTypes";

// Create Schema
const SuggestionsSchema = new mongoose.Schema<SuggestionsInterface>({
    department: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    posted_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
    },
    is_anonymous: {
        type: Boolean,
        default: false,
    },
});

// Create Model
const SuggestionsModel = mongoose.model("suggestions", SuggestionsSchema);

// Exports
export default SuggestionsModel;