import { Client, ClientOptions } from "discord.js";
import { createLogger, format, Logger, transports } from "winston";
import { ClientUtils } from "../utils/ClientUtils";
import { CommandManager, ConfigManager,  EventManager } from "./managers/";

/**
 * `Azuria` is a class that extends the `Client` class from `discord.js`.
 * It includes additional properties for managing configuration, commands, and events, as well as a logger and utility methods.
 *
 * @example
 * const client = new Azuria({ intents: ['GUILD_MESSAGES', 'GUILD_MEMBERS'] });
 * client.start();
 *
 * @class
 * @extends {Client}
 */
export class Azuria extends Client {
    public readonly config: ConfigManager = new ConfigManager(this);
    public readonly commands: CommandManager = new CommandManager(this, "./src/commands");
    public readonly events: EventManager = new EventManager(this, "./src/events");
    public readonly logger: Logger;
    public readonly utils: ClientUtils = new ClientUtils();

    /**
     * Creates an instance of `Azuria`.
     *
     * @param {ClientOptions} options - The options for the `Client`.
     */
    public constructor(options: ClientOptions) {
        super(options);

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
    public async start(): Promise<void> {
        this.events.load();
        await this.login(this.config.token);
    };
}