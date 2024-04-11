import { ApplicationCommandData } from "discord.js";

export interface ICommand {
    data: ApplicationCommandData;
    ephemeral?: boolean;
    modal?: boolean;
    execute(...args: any): void;
}