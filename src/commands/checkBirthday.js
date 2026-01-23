import { SlashCommandBuilder } from 'discord.js';
import { getBirthday } from '../db/userUtils.js';

export default {
    data: new SlashCommandBuilder()
        .setName('checkbirthday')
        .setDescription(`Check a user's birthday in this server`)
        .addUserOption(option =>
            option.setName('target')
                  .setDescription('The user to check the birthday for')
                  .setRequired(false)
        ),

    async execute(interaction) {
        console.log('Check birthday');
        await interaction.deferReply({ ephemeral: true });

        try {
            const user = interaction.options.getUser('target') || interaction.user;

            const result = await getBirthday(user.id, interaction.guild.id);

            if(user.id == interaction.user.id) {
                if (!result) {
                    return interaction.editReply(`😔 No birthday data exists for you.`);
                }
                const bdayStr = `${String(result.getMonth()+1).padStart(2,'0')}-${String(result.getDate()).padStart(2,'0')}-${result.getFullYear()}`;
                return interaction.editReply(`🎂 Your birthday is **${bdayStr}**.`);
            } else {
                if (!result) {
                    return interaction.editReply(`😔 No birthday data exists for **${user.tag}**.`);
                }
                const bdayStr = `${String(result.getMonth()+1).padStart(2,'0')}-${String(result.getDate()).padStart(2,'0')}-${result.getFullYear()}`;
                return interaction.editReply(`🎂 User **${user.tag}**'s birthday is **${bdayStr}**.`);
            }
        } catch (error) {
            console.error(error);
            return interaction.editReply('❌ Something went wrong while fetching the birthday.');
        }
    }
};