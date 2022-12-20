// Configs  
import Messages from "./Messages";

// Get ENV Variables
const isDev = process.env.NODE_ENV === "development";
const port = process.env.PORT || 3000;
const production_db_url = process.env.production_db_url;
const development_db_url = process.env.development_db_url;
const db_url = isDev ? development_db_url : production_db_url;
const DB_Name = isDev ? process.env.DB_NAME_DEV : process.env.DB_Name_PROD;

// MongoDB configs
const DBConfigs = {
  port: port,
  db_url: db_url,
  db_name: DB_Name,
  mode: process.env.NODE_ENV,
  onConnectionSucceed: () => console.log(`Connected to ${DB_Name} Mongo DB...`),
  onConnectionFailed: (error: any) => console.error(Messages.serverError, error),
  onServerListenSuccess: () => console.log(`Mode = ${DBConfigs.mode} and Listening on ${port}..`),
};

export default DBConfigs;
