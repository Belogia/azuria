import { Client, ClientOptions } from "discord.js";
import { createLogger, format, Logger, transports } from "winston";
import { ClientUtils } from "../utils/ClientUtils";
import { CommandManager, ConfigManager,  EventManager } from "./managers";

/**
 * `AzuriaClient` is a class that extends the `Client` class from `discord.js`.
 * It includes additional properties for managing configuration, commands, and events, as well as a logger and utility methods.
 *
 * @example
 * const client = new AzuriaClient({ intents: ['GUILD_MESSAGES', 'GUILD_MEMBERS'] });
 * client.start();
 *
 * @class
 * @extends {Client}
 */
export class AzuriaClient extends Client {
    public readonly apiURL: string;
    public readonly config: ConfigManager = new ConfigManager(this);
    public readonly commands: CommandManager = new CommandManager(this, "./src/commands");
    public readonly events: EventManager = new EventManager(this, "./src/events");
    public readonly logger: Logger;
    public readonly utils: ClientUtils = new ClientUtils();

    /**
     * Creates an instance of `AzuriaClient`.
     *
     * @param {ClientOptions} options - The options for the `Client`.
     */
    public constructor(options: ClientOptions, apiURL: string) {
        super(options);

        this.apiURL = apiURL;
        this.logger = createLogger({
            format: format.combine(
                format.timestamp(),
                format.json()
            ),
            transports: [
                new transports.Console(),
                new transports.File({ filename: "combined.log" })
            ]
        });
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

            await this.config.load();
            await this.commands.load();
        })
        .catch((error) => this.logger.error("CLIENT_START_ERR:", error))
        .finally(() => this.logger.info("Client started."));
    };
}