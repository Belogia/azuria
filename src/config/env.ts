import { config } from "dotenv";
import { MissingEnvVarError } from "./errors/MissingEnvVarError";
import { resolve } from "path";

config({ path: resolve(__dirname, "../../.env") });

export const apiUrl: string | undefined = process.env.API_URL;
export const token: string | undefined = process.env.TOKEN;

if (!apiUrl)
    throw new MissingEnvVarError("API_URL is not defined !");

if (!token)
    throw new MissingEnvVarError("TOKEN is not defined !");
