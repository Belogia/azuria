import { ClientEvents } from "discord.js";
import { AzuriaClient } from "../AzuriaClient";

export interface IEvent<T> {
    readonly client: AzuriaClient<T>;
    readonly name: keyof ClientEvents;
    execute(...args: any): void;
}