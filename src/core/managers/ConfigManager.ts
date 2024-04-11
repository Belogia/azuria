import axios from "axios";
import { IConfig } from "../interfaces";
import { Azuria } from "../Azuria";
import { io, Socket } from "socket.io-client";
import { apiUrl, token } from "../../config/env";

/**
 * `ConfigManager` is a class responsible for fetching and managing the configuration for the `Azuria` client.
 * It fetches the configuration from a specified URL and stores it in the `config` property.
 *
 * @example
 * const configManager = new ConfigManager(client);
 * configManager.load();
 *
 * @class
 */
export class ConfigManager {
    private client: Azuria;
    private socket: Socket;
    private config: IConfig;

    public readonly apiUrl: string;
    public readonly token: string;

    /**
     * Creates an instance of `ConfigManager`.
     *
     * @param {Azuria} client - The client instance for which the configuration will be managed.
     */
    public constructor(client: Azuria) {
        this.client = client;
        this.socket = io("http://localhost:3000");
        this.config = {};

        this.apiUrl = apiUrl!;
        this.token = token!;
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
            const response = await axios.get("http://localhost:3000/config");
            this.config = response.data;

            this.client.logger.info("Config fetched !");
        } catch (error) {
            this.client.logger.error("An error occured while fetching the config !");
            throw new Error("An error occured while fetching the config !");
        }
    }
}