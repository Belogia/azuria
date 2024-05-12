import axios from "axios";
import { AzuriaClient } from "../AzuriaClient";
import { io, Socket } from "socket.io-client";
import { Collection, Snowflake } from "discord.js";

/**
 * `ConfigManager` is a class responsible for fetching and managing the configuration for the `AzuriaClient` client.
 * It fetches the configuration from a specified URL and stores it in the `config` property.
 *
 * @example
 * const configManager = new ConfigManager(client);
 * configManager.load();
 *
 * @class
 */
export class ConfigManager<T> extends Collection<Snowflake, T> {
    private client: AzuriaClient<T>;
    private socket: Socket;

    /**
     * Creates an instance of `ConfigManager`.
     *
     * @param {AzuriaClient} client - The client instance for which the configuration will be managed.
     */
    public constructor(client: AzuriaClient<T>) {
        super();

        this.client = client;
        this.socket = io(""); // todo
    }

    /**
     * Loads the configuration for the client.
     * If the client is ready, it sets up a listener for the `configUpdated` event.
     * When this event is emitted, it fetches the updated configuration and logs a message.
     * If the client is not ready, it logs an error and throws an exception.
     *
     * @public
     * @returns {Promise<void>}
     * @throws {Error} If the client is not ready.
     */
    public async load(): Promise<void> {
        this.client.logger.info("Loading config...");

        if (this.client.user) {
            this.socket.on(`configUpdated:${this.client.user.id}`, () => {
                this.client.logger.info("New config received !");

                this.fetchConfig();

                this.client.logger.info("Config updated !");
            });

            await this.fetchConfig();
        } else {
            this.client.logger.error("Client is not ready yet !");
            throw new Error("Client is not ready yet");
        }

        this.client.logger.info("Config loaded !");
    }


    /**
     * Fetches the configuration from a specified URL and stores it in the `config` property.
     * If an error occurs during this process, it is logged and thrown.
     *
     * @private
     * @returns {Promise<void>}
     */
    private async fetchConfig(): Promise<void> {
        this.client.logger.info("Fetching config...");

        try {
            const response = await axios.get(`https://www.api.belogia.fr/api/v1/bots/${this.client.user?.id}/configs`, {
                headers: {
                    Authorization: `Bearer ${this.client.apiKey}`,
                    "Accept-Encoding": "application/x-www-form-urlencoded",
                    "Content-Type": "application/x-www-form-urlencoded",
                }
            });

            response.data.forEach((config: { guild: Snowflake, guildConfig: T }) => {
                this.set(config.guild, config.guildConfig);
            });

            this.client.logger.info("Config fetched !");
        } catch (error) {
            this.client.logger.error("An error occured while fetching the config !");
        }
    }
}