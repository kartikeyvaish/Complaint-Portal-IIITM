// packages Imports
import jwt from "jsonwebtoken";
import RefreshTokenModel from "../models/RefreshTokensModel";

// Function to generate a JWT token
export function encodeData(data: any) {
    // Return the encoded data
    return jwt.sign(data, process.env.JWT_Key);
}

// Function to decode a JWT token
export function decodeData(token: string) {
    // Return the decoded data
    const isTokenValid = jwt.verify(token, process.env.JWT_Key);

    return isTokenValid;
}

// function to create access token
export function createAccessToken(_id: any) {
    // return the encoded access token
    return jwt.sign({ _id }, process.env.JWT_Key, {
        expiresIn: "1m",
    });
}

// function to create refresh token
export async function createRefreshToken(user_id: any) {
    const newRefreshToken = new RefreshTokenModel({ user_id: user_id });
    await newRefreshToken.save();

    // return the encoded refresh token
    return jwt.sign({ _id: newRefreshToken._id }, process.env.JWT_Key, {
        expiresIn: "7d",
    });
}

// function to verify a accessToken
export async function access_token_validator(token: string) {
    return new Promise((resolve: any, reject: any): any => {
        jwt.verify(token, process.env.JWT_Key, (err, decoded) => {
            if (err) resolve({
                ok: false, error: {
                    name: err.name,
                    message: err.message,
                    status: 401,
                }
            });

            resolve({
                ok: true, decoded,
                status: 200, message: "Token Verified"
            });
        });
    });
}

// function to verify a refreshToken
export async function refresh_token_validator(token: string) {
    return new Promise((resolve: any, _: any): any => {
        jwt.verify(token, process.env.JWT_Key, (err, decoded) => {
            if (err) resolve({
                ok: false,
                error: {
                    name: err.name,
                    message: err.message,
                    status: 401,
                }
            });

            resolve({
                ok: true,
                decoded,
                status: 200,
                message: "Token Verified"
            });
        });
    });
}