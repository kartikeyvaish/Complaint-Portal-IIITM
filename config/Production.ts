// Packages Imports
import compression from "compression";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import path from "path";

// Exporting the production configuration
function production(app: express.Application) {
  // if mode is development then use morgan to show api requests logs
  if (process.env.NODE_ENV !== "production") {
    const morgan = require("morgan");
    app.use(morgan("dev"));
  }
  // Configuring Express for path
  app.use(express.static(path.join(__dirname, "")));
  // Configuring Express to use helmet
  app.use(helmet());
  // Configuring Express to use compression
  app.use(compression());
  // Configuring Express to accept file with a limit of 10mb
  app.use(express.json({ limit: "10mb" }));
  // Configuring Express to bypass cors
  app.use(cors());
  // Configuring Express to use static files
  app.use(express.urlencoded({ extended: true }));
};

export default production;