import { SlashCommandBuilder } from 'discord.js';
import { deleteBirthday } from '../db/userUtils.js';

export default {
    data: new SlashCommandBuilder()
        .setName('removebirthday')
        .setDescription(`Remove a user's birthday in this server`)
        .addUserOption(option =>
            option.setName('target')
                  .setDescription('The user to remove the birthday for')
                  .setRequired(false)
        ),

    async execute(interaction) {
        console.log('Remove birthday');
        await interaction.deferReply({ ephemeral: true });

        try {
            const user = interaction.options.getUser('target') || interaction.user;

            const result = await deleteBirthday(user.id, interaction.guild.id);
            if(user.id == interaction.user.id) {
                return interaction.editReply(`✔️ Your birthday has been removed!`);
            } else {
                return interaction.editReply(`✔️ User **${user.tag}**'s birthday has been removed!`);
            }
        } catch (error) {
            console.error(error);
            return interaction.editReply('❌ Something went wrong while removing the birthday.');
        }
    }
};