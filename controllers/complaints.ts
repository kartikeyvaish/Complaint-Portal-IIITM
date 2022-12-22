// Packages imports 
import mongoose from "mongoose";
import { Request, Response } from "express";

// Models imports  
import ComplaintsModel from "../models/ComplaintsModel";

// Helpers 
import Messages from "../config/Messages";
import { complaintDepartmentFilters, statusFilters } from "../config/Constants";

// function to get complaints
export async function getComplaintsList(req: Request, res: Response) {
    try {
        let count = req.body.count ? parseInt(req.body.count.toString()) : 10;
        let after = req.body.after ? req.body.after.toString() : null;

        // Filter to apply after body
        const afterThis_id = req.body?.after ? new mongoose.Types.ObjectId(req.body.after.toString()) : null;
        let afterIdFilter = after ? { _id: { $lt: afterThis_id } } : {};

        // if complaint_department is not null, then filter based on complaint_department
        let complaint_department = req.body.complaint_department ? complaintDepartmentFilters[req.body.complaint_department] : null;

        // if status is not null, then filter based on status
        let status = req.body.status ? statusFilters[req.body.status] : null;

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
            // Remove unwanted fields
            {
                $project: {
                    user_details: { password: 0, __v: 0, createdAt: 0, updatedAt: 0, _id: 0 },
                    __v: 0,
                    posted_by: 0,
                    final_statement: 0,
                    resolved_attatchments: 0,
                }
            },
        ])

        // Send Response
        return res.status(200).send({ complaints: allComplaints, message: "All Complaints" });
    } catch (error) {
        console.log(error);
        // Error Response 
        return res.status(500).send({ message: Messages.serverError, isLoggedIn: false });
    }
}

// Function to get complaint details
export async function getComplaintDetails(req: Request, res: Response) {
    try {
        // Check if complaint exists
        const complaintObj = await ComplaintsModel.findById(req.body.complaint_id);
        if (!complaintObj) return res.status(404).send({ message: Messages.complaintNotFound });

        // if user who requested the data is ADMIN or the user who posted the complaint
        // then send the complaint details, otherwise unAuthorizedRequest
        const user_id = req.body.user_details._id.toString();
        if (user_id !== complaintObj.posted_by.toString() && req.body.user_details.role !== "ADMIN")
            return res.status(403).send({ message: Messages.unAuthorizedRequest });

        // Send Response
        res.status(200).send({ message: Messages.complaintDetails, complaint: complaintObj });
    } catch (error) {
        // Error Response
        return res.status(500).send({ message: Messages.serverError });
    }
}

// function to create a new complaint 
export async function createComplaint(req: Request, res: Response) {
    try {
        // Get the complaint details from the request body
        const newComplaintObj = new ComplaintsModel({
            title: req.body.title,
            description: req.body.description,
            posted_by: req.body.user_details._id,
            complaint_department: req.body.complaint_department,
        });

        // Save the complaint
        await newComplaintObj.save();

        // Send Response
        res.status(200).send({ message: Messages.complaintCreated, complaint: newComplaintObj });
    } catch (error) {
        // Error Response
        return res.status(500).send({ message: Messages.serverError });
    }
}

// function to mark under consideration
export async function markUnderConsideration(req: Request, res: Response) {
    try {
        return res.status(200).send({ message: "Marked Under Consideration" });
    } catch (error) {
        // Error Response
        return res.status(500).send({ message: Messages.serverError });
    }
}

// Edit complaint
export async function editComplaint(req: Request, res: Response) {
    try {
        // Check if complaint exists
        const complaintObj = await ComplaintsModel.findById(req.body.complaint_id);
        if (!complaintObj) return res.status(404).send({ message: Messages.complaintNotFound });

        // Check if the user who posted the complaint is the same user who is trying to edit the complaint
        if (req.body.user_details._id.toString() !== complaintObj.posted_by.toString())
            return res.status(403).send({ message: Messages.unAuthorizedRequest });

        // Desctructure the fields that can be edited
        const { title, description, complaint_department } = req.body;

        // UPdate the fields that can be edited
        complaintObj.title = title ? title : complaintObj.title;
        complaintObj.description = description ? description : complaintObj.description;
        complaintObj.complaint_department = complaint_department ? complaint_department : complaintObj.complaint_department;

        // Save the complaint
        await complaintObj.save();

        // Send Response
        res.status(200).send({ message: Messages.complaintEdited, complaint: complaintObj });
    } catch (error) {
        // Error Response
        return res.status(500).send({ message: Messages.serverError });
    }
}
