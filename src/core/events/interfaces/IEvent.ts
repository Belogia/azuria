import { ClientEvents } from "discord.js";
import { AzuriaClient } from "@/core";
import { EventListener } from "@/types";

export interface IEvent<T> {
    readonly client: AzuriaClient<T>;
    readonly name: keyof ClientEvents;
    execute: EventListener;
}