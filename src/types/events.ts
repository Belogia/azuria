import { IEvent } from "@/core/interfaces";

export type EventListener = (...args: any[]) => Promise<void>;
export type EventWithoutClient = Omit<IEvent<any>, "client">;
export type EventRegistry = Record<string, EventWithoutClient>;