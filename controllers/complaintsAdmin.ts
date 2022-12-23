// Packages imports  
import { Request, Response } from "express";

// Models imports  
import ComplaintsModel from "../models/ComplaintsModel";

// Helpers 
import { getFilters, isComplainEditable, isComplainValid } from "../helpers/helpers";
import Messages from "../config/Messages";

// function to get complaints
export async function getComplaintsList(req: Request, res: Response) {
    try {
        // An admin can only see complaints from his/her department
        // So perform a check whether req.body.complaint_department is present or not
        // if its present then, return an error saying that admin can only see complaints from his/her department
        if (req.body.complaint_department)
            return res.status(403).send({ message: Messages.complaintAdminInvalid });

        // define complaint_department
        let complaint_department = req.body.user_details.admin_department;

        // Get filters from the request
        const { afterIdFilter, count, status } = getFilters(req);

        // This runs a aggregation to get complaints based on limit, skip,etc
        // A lookup to get the user details who posted the complaint (posted_by)
        const allComplaints = await ComplaintsModel.aggregate([
            // Filter based on after body
            {
                $match: {
                    ...afterIdFilter,

                    // Include complaint_department in the filter if complaint_department is not null
                    ...(complaint_department ? { complaint_department: complaint_department } : {}),

                    // Include status in the filter if status is not null
                    ...(status ? { status: status } : {})
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
            // Lookup to get the user details
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
            // Add a field for comments count
            {
                $addFields: {
                    comments_count: { $size: "$comments" }
                }
            },
            // Remove unwanted fields
            {
                $project: {
                    user_details: { password: 0, __v: 0, createdAt: 0, updatedAt: 0, _id: 0 },
                    __v: 0,
                    posted_by: 0,
                    final_statement: 0,
                    resolved_attatchments: 0,
                    comments: 0,
                }
            },
        ])

        // Send Response
        return res.status(200).send({ complaints: allComplaints, message: "All Complaints" });
    } catch (error) {
        // Error Response 
        return res.status(500).send({ message: Messages.serverError, isLoggedIn: false });
    }
}

// function to mark under consideration
export async function markUnderConsideration(req: Request, res: Response) {
    try {
        // Constants
        let { complaint_id, user_details } = req.body;

        // Check if complaint exists
        const { message: errMessage, valid_complain, complaintObj } = await isComplainValid(complaint_id, user_details.admin_department)
        if (!valid_complain)
            return res.status(400).send({ message: errMessage });

        // Check if the complaint is already resolved/rejected
        const { editable, message } = isComplainEditable(complaintObj.status);
        if (!editable) return res.status(400).send({ message: message });

        // If the complaint is already under consideration, then return error
        if (complaintObj.status === "UNDER CONSIDERATION")
            return res.status(400).send({ message: Messages.alreadyUnderConsideration });

        // update the status of the complaint
        complaintObj.status = "UNDER CONSIDERATION";

        // Save the complaint
        await complaintObj.save();

        return res.status(200).send({ message: Messages.complaintUnderConsideration });
    } catch (error) {
        // Error Response
        return res.status(500).send({ message: Messages.serverError });
    }
}

// function to reject a complaint
export async function rejectComplaint(req: Request, res: Response) {
    try {
        // Constants
        let { complaint_id, user_details, final_statement } = req.body;

        // Check if complaint exists
        const { message: errMessage, valid_complain, complaintObj } = await isComplainValid(complaint_id, user_details.admin_department)
        if (!valid_complain)
            return res.status(403).send({ message: errMessage });

        // Check if the complaint is already resolved/rejected
        const { editable, message } = isComplainEditable(complaintObj.status);
        if (!editable) return res.status(403).send({ message: message });

        // Check if final_statement is provided
        if (final_statement) complaintObj.final_statement = final_statement;

        // update the status of the complaint
        complaintObj.status = "REJECTED";

        // Save the complaint
        await complaintObj.save();

        return res.status(200).send({ message: Messages.complaintRejected });
    } catch (error) {
        // Error Response
        return res.status(500).send({ message: Messages.serverError });
    }
} 