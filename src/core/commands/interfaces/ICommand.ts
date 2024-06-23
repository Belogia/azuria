import { AzuriaClient } from "@/core";
import { CommandData, CommandListener } from "@/types";

export interface ICommand<T> {
    readonly client: AzuriaClient<T>;
    readonly data: CommandData;
    readonly ephemeral?: boolean;
    readonly modal?: boolean;
    execute: CommandListener;
}