
import { readdir } from "fs/promises";
import { Azuria } from "../Azuria";
import { resolve } from "path";
import { IEvent } from "../interfaces/IEvent";

/**
 * `EventManager` is a class responsible for loading and managing event files for the `Azuria` client.
 * It reads the event files from a specified directory, imports them, and attaches them to the client.
 *
 * @example
 * const eventManager = new EventManager(client, './events');
 * eventManager.load();
 *
 * @class
 */
export class EventManager {
    private client: Azuria;
    private path: string;

    /**
     * Creates an instance of `EventsLoader`.
     *
     * @param {Azuria} client - The client instance to which the events will be attached.
     * @param {string} path - The path to the directory containing the event files.
     */
    public constructor(client: Azuria, path: string) {
        this.client = client;
        this.path = path;
    };

    /**
     * Loads the event files from the specified directory, imports them, and attaches them to the client.
     * If an error occurs during this process, it is logged and the process continues with the next file.
     */
    public load(): void {
        readdir(resolve(this.path))
            .then(async (files) => {
                this.client.logger.info(`Loading ${files.length} events...`);

                for (const file of files) {
                    const event = await this.client.utils.import<IEvent>(resolve(this.path, file), this.client);

                    if (event === undefined) throw new Error(`File ${file} is not a valid event file.`);

                    this.client.logger.info(`Events on listener ${event.name} has been added.`);
                    this.client.on(event.name, (...args) => event.execute(...args));
                }
            })
            .catch((error) => this.client.logger.error("EVENTS_LOADER_ERR:", error))
            .finally(() => this.client.logger.info("Done loading events."));
    }
}