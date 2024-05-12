import { ClientOptions } from "discord.js";
import { LoggerOptions } from "winston";

export interface IAzuriaClientOptions extends ClientOptions {
    readonly apiKey: string;
    readonly baseDir: string;
    readonly loggerOptions: LoggerOptions;
}