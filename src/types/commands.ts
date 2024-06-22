import { ApplicationCommandData } from "discord.js";
import { Listener } from "@/types";

export type CommandData = ApplicationCommandData | ApplicationCommandData[];
export type CommandListener = Listener;