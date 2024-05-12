import { ApplicationCommandData, Collection } from "discord.js";
import { readdir } from "fs/promises";
import { resolve } from "path";
import { AzuriaClient } from "../AzuriaClient";
import { ICommand } from "../interfaces";
import { pathToFileURL } from "url";

/**
 * `CommandManager` is a class responsible for loading and managing command files for the `AzuriaClient` client.
 * It reads the command files from a specified directory, imports them, and attaches them to the client.
 *
 * @example
 * const commandManager = new CommandManager(client, './commands');
 * commandManager.load();
 *
 * @class
 * @extends {Collection<string, ICommand>}
 */
export class CommandManager<T> extends Collection<string, ICommand<T>> {
    private client: AzuriaClient<T>;
    private readonly path: string;
    public readonly categories: Collection<string, any> = new Collection<string, any>();

    /**
     * Creates an instance of `CommandManager`.
     *
     * @param {AzuriaClient} client - The client instance to which the commands will be attached.
     * @param {string} path - The path to the directory containing the command files.
     */
    public constructor(client: AzuriaClient<T>, path: string) {
        super();

        this.client = client;
        this.path = path;
    }

    /**
     * Loads the command files from the specified directory, imports them, and attaches them to the client.
     * If an error occurs during this process, it is logged and the process continues with the next file.
     *
     * @public
     * @returns {Promise<void>}
     */
    public async load(): Promise<void> {
        const categories = await readdir(resolve(this.path));

        this.client.logger.info(`Found ${categories.length} categories, registering...`);

        for (const category of categories) {
            const files = await readdir(resolve(this.path, category));

            this.client.logger.info(`Found ${files.length} of commands in ${category}, loading...`);

            for (const file of files) {
                const path = pathToFileURL(resolve(this.path, category, file)).href;
                const command = await this.client.utils.import<ICommand<T>>(path, this.client);

                if (command === undefined) throw new Error(`File ${file} is not a valid command file.`);

                this.set(command.data.name, command);

                await this.register(command.data);
            }
        }
    }

    /**
     * Registers a command with the Discord application.
     * If the client's application is defined, it creates a new command with the provided data.
     * After the command is registered, it logs a message.
     *
     * @private
     * @param {ApplicationCommandData} data - The data for the command to be registered.
     * @returns {Promise<void>}
     * @throws {Error} If the client's application is not defined.
     */
    private async register(data: ApplicationCommandData): Promise<void> {
        if (this.client.application) {
            await this.client.application.commands.create(data);
            this.client.logger.info(`Registered ${data.name}`);
        }
    }
}