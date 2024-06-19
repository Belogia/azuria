import { readdir } from "fs/promises";
import { pathToFileURL } from "url";
import { resolve } from "path";
import { AzuriaClient, EventWrapper, IEvent } from "@/core";
import { DefaultEventsRegistry } from "@/core/events/DefaultEventsRegistry";
import { EventWithoutClient } from "@/types";

/**
 * `EventManager` is a class responsible for loading and managing event files for the `AzuriaClient` client.
 * It reads the event files from a specified directory, imports them, and attaches them to the client.
 *
 * @example
 * const eventManager = new EventManager(client, './events');
 * eventManager.load();
 *
 * @class
 */
export class EventManager<T> {
    private client: AzuriaClient<T>;
    private path: string;
    private wrapper: EventWrapper<T>;

    /**
     * Creates an instance of `EventsLoader`.
     *
     * @param {AzuriaClient} client - The client instance to which the events will be attached.
     * @param {string} path - The path to the directory containing the event files.
     */
    public constructor(client: AzuriaClient<T>, path: string) {
        this.client = client;
        this.path = path;
        this.wrapper = new EventWrapper(client);
    };

    /**
     * Loads the event files from the specified directory and attaches them to the client.
     */
    public load(): void {
        this.loadDefaultEvents();
        this.loadClientEvents();
    }

    /**
     * Loads the default events from the `DefaultEventsRegistry` and attaches them to the client.
     */
    private async loadDefaultEvents(): Promise<void> {
        const events = Object.values(DefaultEventsRegistry);

        this.client.logger.info(`Loading ${events.length} default events...`);

        Promise.all(
            events.map(async (event: EventWithoutClient) => {
                this.client.on(event.name, async (...args: any[]) => await event.execute(this.client, ...args));
                this.client.logger.info(`Events on listener ${event.name} has been added.`);
            })
        );

        this.client.logger.info("Default events loaded.");
    }

    /**
     * Loads the event files from the specified directory, imports them, and attaches them to the client.
     */
    private async loadClientEvents(): Promise<void> {
        const files: string[] = await readdir(resolve(this.path));

        this.client.logger.info(`Loading ${files.length} events...`);

        Promise.all(files.map(async (file: string) => {
            const event = await this.client.utils.import<IEvent<T>>(
                pathToFileURL(
                    resolve(this.path, file)
                ).href,
                this.client
            );

            if (event === undefined)
                throw new Error(`File ${file} is not a valid event file.`);

            if (this.client.eventNames().includes(event.name))
                this.wrapper.wrap(event.name, event.execute);
            else
                this.client.on(event.name, event.execute);
            
            this.client.logger.info(`Events on listener ${event.name} has been added.`);
        }));

        this.client.logger.info("Events loaded.");
    }
}