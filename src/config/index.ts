import dotenv from "dotenv";
dotenv.config();
export const PORT = process.env.PORT!;
export const DBURI = process.env.MONGO_EXPRESS_STRING!;
export const DOMAIN = process.env.DOMAIN!;
export const JWT_SECRET = process.env.JWT_SECRET!;
