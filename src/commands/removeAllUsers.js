import { SlashCommandBuilder } from 'discord.js';
import { deleteServerDocuments } from '../db/userUtils.js';
import 'dotenv/config';

export default {
    data: new SlashCommandBuilder()
        .setName('removeallusers')
        .setDescription(`Remove all users' documents in the server database`),

    async execute(interaction) {
        console.log('Remove all users');
        await interaction.deferReply({ ephemeral: true });

        try {
            const result = await deleteServerDocuments(interaction.guild.id);
            if(result === 0) {
                return interaction.editReply(`❌ No document to remove.`);
            } else {
                return interaction.editReply(`✔️ Removed ${result.deletedCount} documents!`);
            }

            const modLogChannel = interaction.guild.channels.cache.get(process.env.MOD_LOG_CHANNEL_ID);
            if (modLogChannel) {
                modLogChannel.send(`[CakeDay] User **${interaction.user.tag}** remove all user documents for this server.`);
            }
        } catch (error) {
            console.error(error);
            return interaction.editReply('❌ Something went wrong while removing the user.');
        }
    }
};