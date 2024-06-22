import { IEvent } from "@/core";
import { Listener } from "@/types";

export type EventListener = Listener;
export type EventWithoutClient = Omit<IEvent<any>, "client">;
export type EventRegistry = Record<string, EventWithoutClient>;