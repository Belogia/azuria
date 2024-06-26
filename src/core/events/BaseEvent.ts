import { AzuriaClient, IEvent } from "@/core";

/**
 * `BaseEvent` is an abstract class that implements the `IEvent` interface.
 * It serves as a base for all event classes in the `AzuriaClient` client.
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
export abstract class BaseEvent<T = any> implements IEvent<T> {
    public readonly client: AzuriaClient<T>;
    public readonly name: IEvent<T>["name"];

    /**
     * Creates an instance of `BaseEvent`.
     *
     * @param {AzuriaClient} client - The client instance associated with the event.
     * @param {IEvent["name"]} name - The name of the event.
     */
    public constructor(client: AzuriaClient<T>, name: IEvent<T>["name"]) {
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