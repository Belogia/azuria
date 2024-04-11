import { Interaction } from "discord.js";
import { BaseEvent, Event } from "../core";

@Event("interactionCreate")
export class InteractionCreateEvent extends BaseEvent {
    public async execute(interaction: Interaction): Promise<void> {
        this.client.logger.debug(`Received interaction ${interaction.id}`);
        
        if (!interaction.inGuild()) return;

        if (interaction.isChatInputCommand()) {
            const cmd = this.client.commands.get(interaction.commandName);

            if (cmd) {
                if (!cmd.modal) {
                    await interaction.deferReply({ ephemeral: cmd.ephemeral ?? false });
                    cmd.execute(interaction);
                } else
                    cmd.execute(interaction);
            }
        }
    }

}