import 'dotenv/config';
import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import { setBirthday } from '../db/userUtils.js';
import { requirePermission } from '../db/userUtils.js';
import Server from '../models/Server.js';

export default {
    data: new SlashCommandBuilder()
        .setName('settimezone')
        .setDescription('Set the server timezone for birthday announcements')
        .addStringOption(option =>
            option.setName('zone')
                  .setDescription('Choose a timezone')
                  .setRequired(true)
                  .addChoices({ name: 'Pacific (PST/PDT)', value: 'America/Los_Angeles' },
                              { name: 'Central (CST/CDT)', value: 'America/Chicago' },
                              { name: 'Eastern (EST/EDT)', value: 'America/New_York' })
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(interaction) {
        const timezone = interaction.options.getString('zone');

            let server = await Server.findOne({ serverId: interaction.guild.id });

            if (!server) {
                server = await Server.create({
                    serverId: interaction.guild.id,
                    timezone
                });
            } else {
                server.timezone = timezone;
                server.lastBirthdayAnnouncement = null;
                await server.save();
            }

            await interaction.reply({
                content: `✅ Timezone set to **${timezone}**`,
                ephemeral: true
            });
    }
};