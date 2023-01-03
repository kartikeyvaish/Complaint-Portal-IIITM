// Packages imports
import { Request, Response } from "express";

// Local imports
import Messages from "../config/Messages";
import UserModel from "../models/UserModel";

// function to assign admin role to faculty
export async function assignAdmin(req: Request, res: Response) {
    try {
        // Get the user_id from request body
        const { user_id, admin_department } = req.body;

        // Get the user from database
        const userObj = await UserModel.findById(user_id);

        // Check if user exists
        if (!userObj)
            return res.status(404).send({ message: Messages.accountMissing });

        // Check if user is already an admin
        if (userObj.role === "ADMIN")
            return res.status(400).send({ message: Messages.alreadyAdmin });

        // Check if user is a FACULTY/STAFF or not
        if (userObj.role !== "FACULTY" && userObj.role !== "STAFF")
            return res.status(400).send({ message: Messages.adminCriteriaError });

        // Update the user role to ADMIN
        userObj.role = "ADMIN";

        // Update admin_department
        userObj.admin_department = admin_department;

        // Save the user
        await userObj.save();

        // Success Response
        return res.status(200).send({ message: Messages.roleUpdated });
    } catch (error) {
        // Error Response
        return res.status(500).send({ message: Messages.serverError });
    }
}

// function to unassign admin role from faculty
export async function unassignAdmin(req: Request, res: Response) {
    try {
        // Get the user_id from request body
        const { user_id } = req.body;

        // Get the user from database
        const userObj = await UserModel.findById(user_id);

        // Check if user exists
        if (!userObj)
            return res.status(404).send({ message: Messages.accountMissing });

        // Check if user is ADMIN or not
        if (userObj.role !== "ADMIN")
            return res.status(400).send({ message: Messages.notAdmin });

        // Update the user role to initial role
        userObj.role = userObj.initial_role;

        // Save the user
        await userObj.save();

        // Success Response
        return res.status(200).send({ message: Messages.roleUpdated });

    } catch (error) {
        // Error Response
        console.log(error);
        return res.status(500).send({ message: Messages.serverError });
    }
}