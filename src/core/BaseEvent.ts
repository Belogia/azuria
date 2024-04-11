import { Azuria } from "./Azuria";
import { IEvent } from "./interfaces/";

/**
 * `BaseEvent` is an abstract class that implements the `IEvent` interface.
 * It serves as a base for all event classes in the `Azuria` client.
 * Each event class that extends `BaseEvent` must implement the `execute` method.
 *
 * @example
 * class SomeEvent extends BaseEvent {
 *   public execute(...args: any): any {
 *     // Event handling logic here...
 *   }
 * }
 *
 * @class
 * @implements {IEvent}
 */
export abstract class BaseEvent implements IEvent {
    protected client: Azuria;
    public readonly name: IEvent["name"];

    /**
     * Creates an instance of `BaseEvent`.
     *
     * @param {Azuria} client - The client instance associated with the event.
     * @param {IEvent["name"]} name - The name of the event.
     */
    public constructor(client: Azuria, name: IEvent["name"]) {
        this.client = client;
        this.name = name;
    };

    /**
     * An abstract method that must be implemented by each event class.
     * It is called when the event is emitted.
     *
     * @abstract
     * @param {...any} args - The arguments passed to the event.
     * @returns {any}
     */
    public abstract execute(...args: any): any;
}