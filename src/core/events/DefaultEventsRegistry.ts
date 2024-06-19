import { Guild } from "discord.js";
import { AzuriaClient } from "@/core";
import { EventRegistry, EventWithoutClient } from "@/types"
import axios from "axios";

const guildCreate: EventWithoutClient= {
    name: "guildCreate",
    execute: async (client: AzuriaClient, guild: Guild): Promise<void> => {
        client.logger.info(`Registering guild ${guild.name} (${guild.id}) to the API...`);

        axios.post(`http://localhost:3000/api/v1/bots/${guild.client.user.id}/guilds/add`,
            {
                id: guild.id,
                name: guild.name,
                icon: guild.icon
            },
            {
                headers: {
                    Authorization: `Bearer ${client.apiKey}`,
                    "Accept-Encoding": "application/x-www-form-urlencoded",
                    "Content-Type": "application/x-www-form-urlencoded"
                }
            }
        )

        client.logger.info(`Guild ${guild.name} (${guild.id}) has been registered to the API.`);
    }
};

/**
 * The default events registry.
 */
export const DefaultEventsRegistry: EventRegistry = {
    guildCreate
}