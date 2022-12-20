// Packages imports
import bcrypt from "bcrypt";
import mongoose, { Document, Types } from "mongoose";

// Local imports
import { createAccessToken, createRefreshToken } from "./jwt";
import Messages from "../config/Messages";
import { UserSchemaInterface } from "../types/SchemaTypes";

// Requiring ObjectId from mongoose npm package
const ObjectId = mongoose.Types.ObjectId;

/**
 * * This is a function to check if the password is valid or not
 * @param password The password to be checked
 * @param hash The hash to be checked against
 * @returns an object with a boolean value and a message
 */
export function validateCredentials(password: string, hash: string) {
    try {
        const checkPassword = bcrypt.compareSync(password, hash);
        if (checkPassword) {
            return { isCorrect: true, message: Messages.correctPassword };
        } else {
            return { isCorrect: false, message: Messages.incorrectPassword };
        }
    } catch (error) {
        return { isCorrect: false, message: Messages.serverError };
    }
}


/**
 * * This is a function to check if a given string is a valid ObjectId or not
 * @param id The string to be checked 
 * @returns an object with a boolean value
 */
export function isValidObjectId(id: string) {
    if (ObjectId.isValid(id)) {
        if ((String)(new ObjectId(id)) === id)
            return true;

        return false;
    }

    return false;
}

/**
 * * This function is used to get login/signup response
 * @param userObj The User object from which data has to be fetched
 * @returns an object with the required data
 */
export async function getUserPayload(userObj: Document<unknown, any, UserSchemaInterface> & UserSchemaInterface & {
    _id: Types.ObjectId;
}) {
    const data = userObj.toObject();

    // prepare access token and refresh token
    const accessToken = createAccessToken(data._id);
    const refreshToken = await createRefreshToken(data._id);

    // Removing unnecessary data
    delete data._id
    delete data.password;
    delete data.account_created_at;
    delete data.last_updated_at;

    // Create payload to be sent
    const payload = {
        user: data,
        accessToken,
        refreshToken,
    }

    // return the encoded payload
    return payload
} 