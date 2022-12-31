// Packages imports  
import { Request, Response } from "express";
import mongoose from "mongoose";

// Models imports   
import SuggestionsModel from "../models/SuggestionsModel";

// Helpers 
import Messages from "../config/Messages";

// function to get all suggestions from a department
export async function getSuggestions(req: Request, res: Response) {
    try {
        // Get params
        let department = req.body.user_details.admin_department;
        let count = req.body.count ? parseInt(req.body.count.toString()) : 10;
        let after = req.body.after ? req.body.after.toString() : null;

        // Filter to apply after body
        const afterThis_id = req.body?.after ? new mongoose.Types.ObjectId(req.body.after.toString()) : null;
        let afterIdFilter = after ? { _id: { $lt: afterThis_id } } : {};

        const allSuggestions = await SuggestionsModel.aggregate([
            // Filter based on after body
            {
                $match: {
                    ...afterIdFilter,

                    // Include department in the filter if department is not null
                    ...(department ? { department: department } : {}),
                },
            },
            // sort them in descending order of _id
            {
                $sort: {
                    _id: -1,
                },
            },
            // limit to count
            {
                $limit: count,
            },
            // Lookup to get the user details also fetch details only if is_anonymous is false
            {
                $lookup:
                {
                    from: "users",
                    localField: "posted_by",
                    foreignField: "_id",
                    as: "user_details"
                }
            },
            // Unwind user_details
            {
                $unwind: {
                    path: "$user_details",
                    preserveNullAndEmptyArrays: true,
                },
            },
            // Remove unwanted fields
            {
                $project: {
                    user_details: { name: 1, email: 1, phone: 1 },
                    _id: 1,
                    department: 1,
                    description: 1,
                    is_anonymous: 1,
                }
            },
        ])

        // Send Response
        return res.status(200).send({ complaints: allSuggestions, message: "All Suggestions" });
    } catch (error) {
        // Error Response
        return res.status(500).send({ message: Messages.serverError });
    }
}

// function to add suggestion
export async function addSuggestion(req: Request, res: Response) {
    try {
        // Create new suggestion
        const newSuggestion = new SuggestionsModel({
            department: req.body.department,
            description: req.body.description,
            is_anonymous: req.body.is_anonymous,
            posted_by: req.body.is_anonymous ? null : req.body.user_details._id,
        })

        // Save the suggestion
        await newSuggestion.save();

        // Send Response
        return res.status(200).send({ suggestion: newSuggestion, message: "Suggestion Added" });
    } catch (error) {
        // Error Response
        return res.status(500).send({ message: Messages.serverError });
    }
}