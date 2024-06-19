import { ClientEvents } from "discord.js";
import { AzuriaClient } from "@/core";
import { EventListener } from "@/types";

/**
 * The `EventWrapper` class provides a mechanism to enhance or modify the behavior of event listeners
 * within the `AzuriaClient` framework. It allows for the wrapping of existing event listeners with
 * additional functionality, enabling more complex event handling scenarios.
 *
 * @template T The client's type, allowing for type-safe interaction within the event listeners.
 *
 * @example
 * // Example of wrapping an event to add custom behavior before the original listener
 * const client = new AzuriaClient();
 * const eventWrapper = new EventWrapper(client);
 * eventWrapper.wrap('messageCreate', async (message) => {
 *   console.log('Message received:', message.content);
 *   // Custom logic can be added here
 * });
 *
 * @class EventWrapper
 */
export class EventWrapper<T> {
    private client: AzuriaClient<T>;

    /**
     * Creates an instance of `EventWrapper`.
     *
     * @param {AzuriaClient} client - The client instance to which the event wrapper will be attached.
     */
    public constructor(client: AzuriaClient<T>) {
        this.client = client;
    }

    /**
     * Wraps an existing event listener with additional functionality.
     * The original listener is executed first, followed by the custom listener.
     *
     * @param {keyof ClientEvents} event - The name of the event to wrap.
     * @param {EventListener} listener - The custom listener to add to the event.
     */
    public wrap(event: keyof ClientEvents, listener: EventListener) {
        const defaultListener: EventListener = this.client.listeners(event)[0] as EventListener;

        this.client.removeListener(event, defaultListener);
        this.client.on(event, async (...args: any[]) => {
            await defaultListener(this.client, ...args);
            await listener(...args);
        });
    }
}