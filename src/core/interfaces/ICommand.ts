import { ApplicationCommandData } from "discord.js";
import { AzuriaClient } from "../AzuriaClient";

export interface ICommand<T> {
    readonly client: AzuriaClient<T>;
    readonly data: ApplicationCommandData;
    readonly ephemeral?: boolean;
    readonly modal?: boolean;
    execute(...args: any): void;
}