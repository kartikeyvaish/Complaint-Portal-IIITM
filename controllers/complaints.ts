// Packages imports 
import mongoose from "mongoose";
import { Request, Response } from "express";

// Models imports  
import ComplaintsModel from "../models/ComplaintsModel";
import UserModel from "../models/UserModel";

// Helpers 
import { canAccessResource, getFilters, isComplainEditable } from "../helpers/helpers";
import Messages from "../config/Messages";

// Function to get complaints posted by the user
export async function getOwnComplaints(req: Request, res: Response) {
    try {
        // Get user_id from the request body
        const user_id = req.body.user_details._id.toString();

        // get complaints posted by the user
        // Get filters from the request
        const { afterIdFilter, complaint_department, count, status } = getFilters(req);

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
                    ...(status ? { status: status } : {}),

                    // Filter based on user_id
                    posted_by: new mongoose.Types.ObjectId(user_id)
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
            // Add a field for comments count
            {
                $addFields: {
                    comments_count: { $size: "$comments" }
                }
            },
            // Remove unwanted fields
            {
                $project: {
                    __v: 0,
                    posted_by: 0,
                    comments: 0,
                }
            },
        ])

        // Send Response
        return res.status(200).send({ complaints: allComplaints, message: "All Complaints" });
    } catch (error) {
        // Error Response
        return res.status(500).send({ message: Messages.serverError });
    }
}

// Function to get complaint details
export async function getComplaintDetails(req: Request, res: Response) {
    try {
        // Check if complaint exists
        const complaintObj = await ComplaintsModel.findById(req.body.complaint_id);
        if (!complaintObj) return res.status(404).send({ message: Messages.complaintNotFound });

        // Check if user can access the resource
        const { ok, message: ErrMsg } = canAccessResource(req, complaintObj);
        if (!ok) return res.status(403).send({ message: ErrMsg });

        // Get user details who posted the complaint (for admin view)
        let posted_by_details = null
        if (req.body.user_details.role === "ADMIN" && complaintObj.posted_by.toString() !== req.body.user_details._id.toString()) {
            const userObj = await UserModel.findById(complaintObj.posted_by);

            if (userObj) {
                posted_by_details = {
                    name: userObj.name,
                    email: userObj.email,
                    role: userObj.role,
                    phone: userObj.phone,
                }
            }
        }

        // Send Response
        return res.status(200).send({
            message: Messages.complaintDetails,
            complaint: complaintObj,
            // Include user details only it has been requested by ADMIN
            // If a user requests for his own complaint details, then user_details will be null
            // This is done to prevent user from getting other user details
            // Also, a user will not want to see his/her details. It is already known to him/her
            ...(posted_by_details ? { user_details: posted_by_details } : {})
        });
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
            location: req.body.location || null
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

// Edit complaint
export async function editComplaint(req: Request, res: Response) {
    try {
        // Check if complaint exists
        const complaintObj = await ComplaintsModel.findById(req.body.complaint_id);
        if (!complaintObj) return res.status(404).send({ message: Messages.complaintNotFound });

        // Check if the user who posted the complaint is the same user who is trying to edit the complaint
        if (req.body.user_details._id.toString() !== complaintObj.posted_by.toString())
            return res.status(403).send({ message: Messages.unAuthorizedRequest });

        // Check if the complaint is already resolved/rejected
        const { editable, message } = isComplainEditable(complaintObj.status);
        if (!editable) return res.status(403).send({ message: message });

        // Desctructure the fields that can be edited
        const { title, description, complaint_department, location } = req.body;

        // Update the fields that can be edited
        complaintObj.title = title ? title : complaintObj.title;
        complaintObj.description = description ? description : complaintObj.description;
        complaintObj.complaint_department = complaint_department ? complaint_department : complaintObj.complaint_department;
        complaintObj.location = location ? location : complaintObj.location;

        // Save the complaint
        await complaintObj.save();

        // Send Response
        res.status(200).send({ message: Messages.complaintEdited, complaint: complaintObj });
    } catch (error) {
        // Error Response
        return res.status(500).send({ message: Messages.serverError });
    }
}

// Add commenet
export async function addComment(req: Request, res: Response) {
    try {
        // Check if complaint exists
        const complaintObj = await ComplaintsModel.findById(req.body.complaint_id);
        if (!complaintObj) return res.status(404).send({ message: Messages.complaintNotFound });

        // Check if the complaint is already resolved/rejected
        const { editable: canComment, message } = isComplainEditable(complaintObj.status);
        if (!canComment) return res.status(403).send({ message: message });

        // Check if user can access the resource
        const { ok, message: ErrMsg } = canAccessResource(req, complaintObj);
        if (!ok) return res.status(403).send({ message: ErrMsg });

        // Create a new comment
        const newComment = {
            comment: req.body.comment,
            commented_by: req.body.user_details._id,
            isDeleted: false,
        }

        // Add the comment
        complaintObj.comments.push(newComment);

        // Save the complaint
        await complaintObj.save();

        return res.status(200).send({ message: Messages.addedComment, new_comment: complaintObj.comments[complaintObj.comments.length - 1] });
    } catch (error) {
        // Error Response
        return res.status(500).send({ message: Messages.serverError });
    }
}

// Delete comment
export async function deleteComment(req: Request, res: Response) {
    try {
        // Check if complaint exists
        const complaintObj: any = await ComplaintsModel.findById(req.body.complaint_id);
        if (!complaintObj) return res.status(404).send({ message: Messages.complaintNotFound });

        // Check if the complaint is already resolved/rejected
        const { editable: canComment, message } = isComplainEditable(complaintObj.status);
        if (!canComment) return res.status(403).send({ message: message });

        // Check if user can access the resource
        const { ok, message: ErrMsg } = canAccessResource(req, complaintObj);
        if (!ok) return res.status(403).send({ message: ErrMsg });

        // Check if the comment exists
        const commentIndex = complaintObj.comments.findIndex(comment => comment._id.toString() === req.body.comment_id);
        if (commentIndex === -1)
            return res.status(404).send({ message: Messages.commentNotFound });

        // Check if it's your comment
        if (req.body.user_details._id.toString() !== complaintObj.comments[commentIndex].commented_by.toString())
            return res.status(403).send({ message: Messages.unAuthorizedRequest });

        // Check if the comment is already deleted
        if (complaintObj.comments[commentIndex].isDeleted)
            return res.status(400).send({ message: Messages.commentAlreadyDeleted });

        // Delete the comment
        complaintObj.comments[commentIndex].isDeleted = true;

        // Save the complaint
        await complaintObj.save();

        // Send Response
        return res.status(200).send({ message: Messages.complaintDeleted });
    } catch (error) {
        // Error Response
        return res.status(500).send({ message: Messages.serverError });
    }
}