// Packages imports 
import mongoose from "mongoose";
import { Request, Response } from "express";

// Models imports  
import ComplaintsModel from "../models/ComplaintsModel";

// Helpers 
import Messages from "../config/Messages";

// function to get complaints
export async function getComplaints(req: Request, res: Response) {
    try {
        let count = req.query.count ? parseInt(req.query.count.toString()) : 10;
        let after = req.query.after ? req.query.after.toString() : null;

        // Filter to apply after query
        const afterThis_id = req.query?.after ? new mongoose.Types.ObjectId(req.query.after.toString()) : null;
        let after_this_id_filter = after ? { _id: { $lt: afterThis_id } } : {};

        // This runs a aggregation to get complaints based on limit, skip,etc
        // A lookup to get the user details who posted the complaint (posted_by)
        const allComplaints = await ComplaintsModel.aggregate([
            // Filter based on after query
            {
                $match: { ...after_this_id_filter },
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
        // Error Response 
        return res.status(500).send({ message: Messages.serverError, isLoggedIn: false });
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
        res.status(200).send({ message: Messages.complaintCreated });
    } catch (error) {
        // Error Response
        return res.status(500).send({ message: Messages.serverError });
    }
}