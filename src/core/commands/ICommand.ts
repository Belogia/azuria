import { AzuriaClient } from "@/core";
import { CommandData } from "@/types";

export interface ICommand<T> {
    readonly client: AzuriaClient<T>;
    readonly data: CommandData;
    readonly ephemeral?: boolean;
    readonly modal?: boolean;
    execute(...args: any): void;
}