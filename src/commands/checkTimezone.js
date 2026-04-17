import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import Server from '../models/Server.js';

export default {
    data: new SlashCommandBuilder()
        .setName('checktimezone')
        .setDescription('Check the server timezone for birthday announcements')
        .setDefaultMemberPermissions(PermissionFlagsBits.SendMessages),

    async execute(interaction) {
        let server = await Server.findOne({ serverId: interaction.guild.id });

        // fallback if server doc doesn't exist yet
        if (!server) {
            server = await Server.create({serverId: interaction.guild.id,
                                        timezone: 'America/Los_Angeles'});
        }

        const timezone = server.timezone || 'America/Los_Angeles';

        const labelMap = {
            'America/Los_Angeles': 'Pacific Time (PST/PDT)',
            'America/Chicago': 'Central Time (CST/CDT)',
            'America/New_York': 'Eastern Time (EST/EDT)'
        };

        await interaction.reply({
            content: `🕒 Current server timezone is **${labelMap[timezone] || timezone}** (\`${timezone}\`)`,
            ephemeral: true
        });
    }
};

