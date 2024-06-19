import { CommandData } from "@/types";

/**
 * `BaseDecorator` is a class decorator factory that takes any data as a parameter.
 * It returns a class decorator that modifies the behavior of the class constructor.
 * The decorator uses a Proxy to intercept the `construct` operation.
 * When a new instance of the class is created, the decorator modifies the constructor
 * to accept the data as an additional argument at the end of its original arguments.
 *
 * @param data - The additional argument to be passed to the class constructor.
 *
 * @returns A class decorator that modifies the class constructor.
 *
 * @template T - The type of the class constructor. It's a constructor function that can take any number of arguments of any type.
 *
 * @param constructor - The original constructor of the class.
 *
 * @returns A Proxy for the class constructor. The Proxy intercepts the `construct` operation and modifies the constructor to accept an additional argument `data`.
 */
export function BaseDecorator(data: any) {
    return function <T extends new (...args: any[]) => {}>(constructor: T) {
        return new Proxy(constructor, {
            construct: (target: T, args: ConstructorParameters<T>) => {
                return new target(...args, data);
            }
        });
    }
}

/**
 * `Command` is a function that takes an `ICommandComponent` object and returns a class decorator.
 * The decorator modifies the class constructor to accept the `ICommandComponent` object as an additional argument.
 *
 * @param data - The `ICommandComponent` object to be passed to the class constructor.
 *
 * @returns A class decorator that modifies the class constructor.
 */
export const Command = (data: CommandData) => BaseDecorator(data);

/**
 * `Event` is a function that takes a string `name` and returns a class decorator.
 * The decorator modifies the class constructor to accept the `name` as an additional argument.
 *
 * @param name - The name to be passed to the class constructor.
 *
 * @returns A class decorator that modifies the class constructor.
 */
export const Event = (name: string) => BaseDecorator(name);