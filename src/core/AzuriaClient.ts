import { Client } from "discord.js";
import { createLogger, Logger } from "winston";
import { resolve } from "path";
import { IAzuriaClientOptions } from "./interfaces/";
import { CommandManager, ConfigManager, EventManager } from "./managers";
import { ClientUtils } from "../utils/ClientUtils";

/**
 * `AzuriaClient` is a class that extends the `Client` class from `discord.js`.
 * It includes additional properties for managing configuration, commands, and events, as well as a logger and utility methods.
 *
 * @example
 * const client = new AzuriaClient<MyBotConfig>({
 *      apiKey: process.env.API_TOKEN,
 *      baseDir: __dirname,
 *      intents: [...],
 *      partials: [...],
 *      loggerOptions: {
 *          ...
 *      }
 * });
 * 
 * client.start();
 *
 * @class
 * @extends {Client}
 */
export class AzuriaClient<T = any> extends Client {
    public readonly apiKey: string;
    public readonly configs: ConfigManager<T>;
    public readonly commands: CommandManager<T>;
    public readonly events: EventManager<T>;
    public readonly logger: Logger;
    public readonly utils: ClientUtils = new ClientUtils();

    /**
     * Creates an instance of `AzuriaClient`.
     *
     * @param {AzuriaClientOptions} options - The options for the `Client`.
     */
    public constructor(options: IAzuriaClientOptions) {
        super(options);

        this.apiKey = options.apiKey;
        this.configs = new ConfigManager(this)
        this.commands = new CommandManager(this, resolve(options.baseDir, "./commands"));
        this.events = new EventManager(this, resolve(options.baseDir, "./events"));
        this.logger = createLogger(options.loggerOptions);
    }

    /**
     * Starts the client.
     * It loads the events, logs in the client with the token from the configuration.
     *
     * @public
     * @returns {Promise<void>}
     */
    public async start(token: string): Promise<void> {
        this.events.load();

        this.login(token)
            .then(async () => {
                this.logger.info("Logged in successfully.");

                await this.configs.load();
                await this.commands.load();
            })
            .catch((error) => this.logger.error("CLIENT_START_ERR:", error))
            .finally(() => this.logger.info("Client started."));
    };
}