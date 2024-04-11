import { ApplicationCommandData } from "discord.js";
import { Azuria } from "./Azuria";
import { ICommand } from "./interfaces";

/**
 * `BaseCommand` is an abstract class that implements the `ICommand` interface.
 * It provides a base structure for creating new commands for the `Azuria` client.
 * Each command must implement the `execute` method.
 *
 * @example
 * class MyCommand extends BaseCommand {
 *     public execute(...args: any): any {
 *         // Implementation of the command.
 *     }
 * }
 *
 * @abstract
 * @class
 * @implements {ICommand}
 */
export abstract class BaseCommand implements ICommand {
    protected client: Azuria;
    public readonly data: ApplicationCommandData;

    /**
     * Creates an instance of `BaseCommand`.
     *
     * @param {Azuria} client - The client instance to which the command will be attached.
     * @param {ApplicationCommandData} data - The data for the command.
     */
    public constructor(client: Azuria, data: ApplicationCommandData) {
        this.client = client;
        this.data = data;
    };

    /**
     * An abstract method that must be implemented in any class that extends `BaseCommand`.
     * This method will contain the implementation of the command.
     *
     * @abstract
     * @param {...any} args - The arguments for the command.
     * @returns {any}
     */
    public abstract execute(...args: any): any;
}