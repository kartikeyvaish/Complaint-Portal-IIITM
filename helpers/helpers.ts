// Packages imports
import { Request } from "express";
import mongoose from "mongoose";

// Local imports
import { complaintDepartmentFilters, statusFilters } from "../config/Constants";

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