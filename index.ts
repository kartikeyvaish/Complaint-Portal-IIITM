// Importing Packages
import express from "express";
import mongoose from "mongoose";
import path from "path";
import * as dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config()

// Importing configs/files  
import DBConfigs from "./config/db_configs";
import prod_configs from "./config/Production";

// Importing routes     
import AuthRoutes from "./routes/auth";
import ComplaintsRoutes from "./routes/complaints";
import ComplaintsAdminRoutes from "./routes/complaintsAdmin";
import OTPRoutes from "./routes/otp";
import SuperAdminRoutes from "./routes/superAdminRoutes";

// Connect to MongoDB
mongoose.set('strictQuery', true);
mongoose.connect(DBConfigs.db_url).then(DBConfigs.onConnectionSucceed).catch(DBConfigs.onConnectionFailed);

// Express app initialization
const app = express();

// Configuring Express to use static files
app.use(express.static(path.join(__dirname, "")));

// Configuring Express app for Production
prod_configs(app);

// Add Routes  
app.use(process.env.apiVersion + process.env.auth, AuthRoutes);
app.use(process.env.apiVersion + process.env.complaints, ComplaintsRoutes);
app.use(process.env.apiVersion + process.env.complaintsAdmin, ComplaintsAdminRoutes);
app.use(process.env.apiVersion + process.env.otp, OTPRoutes);
app.use(process.env.apiVersion + process.env.superAdmin, SuperAdminRoutes);
app.use(process.env.apiVersion + process.env.okResponseRoute, DBConfigs.okResponse);

// Add a 404 error handler
app.use((_, res, __) => res.status(404).send({ message: "404: Not Found" }));

// App listening on port
app.listen(DBConfigs.port, DBConfigs.onServerListenSuccess); 