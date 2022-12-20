declare namespace NodeJS {
    export interface ProcessEnv {
        NODE_ENV: "development" | "production" | "test";

        DB_Name_PROD: string;
        DB_NAME_DEV: string;

        mongodb_compass_url: string;
        production_db_url: string;
        development_db_url: string;


        apiVersion: string
        auth: string
        otp: string
        complaints: string

        google_admin_email: string
        google_app_password: string

        JWT_Key: string

        defaultPassHash: string
    }
}