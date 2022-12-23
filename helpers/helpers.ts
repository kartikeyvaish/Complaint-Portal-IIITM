// Packages imports
import { Request } from "express";
import mongoose from "mongoose";

// Local imports
import { complaintDepartmentFilters, statusFilters } from "../config/Constants";
import Messages from "../config/Messages";
import ComplaintsModel from "../models/ComplaintsModel";
import { validComplaintResponse } from "../types/GeneralTypes";

/** 
 * * function to check if a email is valid student email or not (for IIITM Gwalior)
 * - It should start with bcs, imt, img, cn
 * - It should end with @iiitm.ac.in
 */
export function isValidStudentEmail(email: string) {
    // if email is empty return false
    if (!email)
        return false;

    // Domain check
    if (email.endsWith("@iiitm.ac.in") === false)
        return false;

    // Batch check
    let eligibleBatches = ["bcs", "imt", "img", "cn"]
    let isEligible = false;

    for (let i = 0; i < eligibleBatches.length; i++) {
        if (email.startsWith(eligibleBatches[i])) {
            isEligible = true;
            break;
        }
    }

    if (!isEligible)
        return false;

    return true;
}

// Function to add leading zeros to a number
export function addLeadingZeros(num: number, totalLength: number) {
    return String(num).padStart(totalLength, '0');
}

// function to get filters
/** 
 * * function to get filters from request body
 * @returns {Object} count, afterIdFilter, complaint_department, status
 */
export function getFilters(req: Request) {
    let count = req.body.count ? parseInt(req.body.count.toString()) : 10;
    let after = req.body.after ? req.body.after.toString() : null;

    // Filter to apply after body
    const afterThis_id = req.body?.after ? new mongoose.Types.ObjectId(req.body.after.toString()) : null;
    let afterIdFilter = after ? { _id: { $lt: afterThis_id } } : {};

    // if complaint_department is not null, then filter based on complaint_department
    let complaint_department = req.body.complaint_department ? complaintDepartmentFilters[req.body.complaint_department] : null;

    // if status is not null, then filter based on status
    let status = req.body.status ? statusFilters[req.body.status] : null;

    return {
        count,
        afterIdFilter,
        complaint_department,
        status
    }
}

// Check for complaint editibility
// If a complaint is REJECTED or RESOLVED, then it is not editable in any case
export function isComplainEditable(status: string) {
    // Check if status is already resolved
    if (status === "RESOLVED")
        return { editable: false, message: Messages.alreadyResolved };

    // Check if status is already rejected
    if (status === "REJECTED")
        return { editable: false, message: Messages.alreadyRejected };

    return { editable: true, message: null };
}

// Check if a complaint is valid or not
// Also, if the user who has called the API is valid admin with his department same as complaint department
export async function isComplainValid(complain_id: string, admin_department: string): Promise<validComplaintResponse> {
    // Check if complaint exists
    let complaintObj = await ComplaintsModel.findById(complain_id);
    if (!complaintObj) return { valid_complain: false, message: Messages.complaintNotFound, complaintObj: null };

    // Check if admin is from same department as the complaint
    if (admin_department !== complaintObj.complaint_department)
        return { valid_complain: false, message: Messages.complaintAdminInvalid, complaintObj: null };

    return { valid_complain: true, message: null, complaintObj: complaintObj };
}

// Check if a user ro admin can access a resource based on their relation with the complaint
export function canAccessResource(req: Request, complaintObj: any) {
    // Get user details who requested the data
    const user_details = req.body.user_details
    const user_id = user_details._id.toString();
    const complaintOwnerId = complaintObj.posted_by.toString();

    // if user who requested the data is ADMIN (& belong to the same department as complaint is) or the user who posted the complaint
    if (user_details.role === "ADMIN") {
        if (user_details.admin_department !== complaintObj.complaint_department && user_id !== complaintOwnerId)
            return { ok: false, message: Messages.complaintAdminInvalid }
    } else {
        // Else check if the user who posted the complaint is the same user who is trying to delete a comment
        if (user_id !== complaintOwnerId)
            return { ok: false, message: Messages.unAuthorizedRequest }
    }

    return { ok: true, message: null }
}