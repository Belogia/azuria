import { Client, ClientOptions } from "discord.js";
import { createLogger, format, Logger, transports } from "winston";
import { resolve } from "path";
import { CommandManager, ConfigManager,  EventManager } from "./managers";
import { ApiUrlNotDefinedError, TokenNotDefinedError } from "./errors";
import { ClientUtils } from "../utils/ClientUtils";

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
    public readonly baseDir: string;
    public readonly config: ConfigManager = new ConfigManager(this);
    public readonly commands: CommandManager;
    public readonly events: EventManager;
    public readonly logger: Logger;
    public readonly utils: ClientUtils = new ClientUtils();

    /**
     * Creates an instance of `AzuriaClient`.
     *
     * @param {ClientOptions} options - The options for the `Client`.
     */
    public constructor(options: ClientOptions, baseDir: string) {
        super(options);

        if (process.env.TOKEN === undefined)
            throw new TokenNotDefinedError();

        if (process.env.API_URL === undefined)
            throw new ApiUrlNotDefinedError();

        this.apiURL = process.env.API_URL;
        this.baseDir = baseDir;
        this.commands = new CommandManager(this, resolve(this.baseDir, "./commands"));
        this.events = new EventManager(this, resolve(this.baseDir, "./events"));
        this.logger = createLogger({
            format: format.combine(
                format.timestamp(),
                format.json()
            ),
            transports: [
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
        this.login(process.env.TOKEN)
        .then(async () => {
            this.logger.info("Logged in successfully.");

            await this.config.load();
            await this.commands.load();
        })
        .catch((error) => this.logger.error("CLIENT_START_ERR:", error))
        .finally(() => this.logger.info("Client started."));
    };
}