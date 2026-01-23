import { SlashCommandBuilder } from 'discord.js';
import { deleteDocument } from '../db/userUtils.js';
import 'dotenv/config';

export default {
    data: new SlashCommandBuilder()
        .setName('removeuser')
        .setDescription(`Remove a user's document in the server database`)
        .addUserOption(option =>
            option.setName('target')
                  .setDescription('The user to remove')
                  .setRequired(false)
        ),

    async execute(interaction) {
        console.log('Remove user');
        await interaction.deferReply({ ephemeral: true });

        try {
            const user = interaction.options.getUser('target') || interaction.user;

            const result = await deleteDocument(user.id, interaction.guild.id);
            if(user.id == interaction.user.id) {
                return interaction.editReply(`✔️ Your document has been removed!`);
            } else {
                return interaction.editReply(`✔️ User **${user.tag}**'s document has been removed!`);
            }

            const modLogChannel = interaction.guild.channels.cache.get(process.env.MOD_LOG_CHANNEL_ID);
            if (modLogChannel) {
                modLogChannel.send(`[CakeDay] User **${interaction.user.tag}** remove **${user.tag}**'s document,`);
            }
        } catch (error) {
            console.error(error);
            return interaction.editReply('❌ Something went wrong while removing the user.');
        }
    }
};