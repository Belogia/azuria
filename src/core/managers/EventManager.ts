import { readdir } from "fs/promises";
import { pathToFileURL } from "url";
import { Guild } from "discord.js";
import { resolve } from "path";
import axios from "axios";
import { AzuriaClient } from "../AzuriaClient";
import { IEvent } from "../interfaces/IEvent";

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

    /**
     * Creates an instance of `EventsLoader`.
     *
     * @param {AzuriaClient} client - The client instance to which the events will be attached.
     * @param {string} path - The path to the directory containing the event files.
     */
    public constructor(client: AzuriaClient<T>, path: string) {
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
                    const event = await this.client.utils.import<IEvent<T>>(pathToFileURL(resolve(this.path, file)).href, this.client);

                    if (event === undefined) throw new Error(`File ${file} is not a valid event file.`);

                    this.client.logger.info(`Events on listener ${event.name} has been added.`);
                    this.client.on(event.name, (...args) => event.execute(...args));
                }

                this.loadDefaultEvents();
            })
            .catch((error) => this.client.logger.error("EVENTS_LOADER_ERR:", error))
            .finally(() => this.client.logger.info("Done loading events."));
    }

    private loadDefaultEvents(): void {
        let listener = (...args: any[]) => { };

        this.client.logger.info("Loading default events...");

        if (this.client.eventNames().includes("guildCreate")) {
            listener = this.client.listeners("guildCreate")[0] as (...args: any[]) => void;
            this.client.removeListener("guildCreate", listener);
        }

        this.client.on("guildCreate", async (...args: any[]) => {
            const guild = args[0] as Guild;

            this.client.logger.info(`Registering guild ${guild.name} (${guild.id}) to the API...`);

            axios.post(`http://localhost:3000/api/v1/bots/${guild.client.user.id}/guilds/add`,
                {
                    id: guild.id,
                    name: guild.name,
                    icon: guild.icon
                },
                {
                    headers: {
                        Authorization: `Bearer ${this.client.apiKey}`,
                        "Accept-Encoding": "application/x-www-form-urlencoded",
                        "Content-Type": "application/x-www-form-urlencoded"
                    }
                }
            )

            this.client.logger.info(`Guild ${guild.name} (${guild.id}) has been registered to the API.`);

            listener(...args);
        });
    }
}