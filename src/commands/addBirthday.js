import { SlashCommandBuilder } from 'discord.js';
import { setBirthday } from '../db/userUtils.js';

export default {
    data: new SlashCommandBuilder()
        .setName('addbirthday')
        .setDescription('Add new user birthday to this server')
        .addStringOption(option =>
            option.setName('birthday')
                  .setDescription('Birthday in MM-DD format (e.g., 08-15)')
                  .setRequired(true)
        )
        .addUserOption(option =>
            option.setName('target')
                  .setDescription('The user to set the birthday for')
                  .setRequired(false)
        ),

    async execute(interaction) {
        console.log('Add birthday');
        await interaction.deferReply({ ephemeral: true });

        try {
            const bday = interaction.options.getString('birthday').trim();
            const user = interaction.options.getUser('target') || interaction.user;

            if(!/^(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/.test(bday)) {
                return interaction.editReply('Invalid format. Please use MM-DD (e.g., 08-15).');
            }
            const result = await setBirthday(user.id, interaction.guild.id, bday);

            if(user.id == interaction.user.id) {
                return interaction.editReply(`🎉 Your birthday has been set to **${result.birthday}**.`);
            } else {
                return interaction.editReply(`🎉 User **${user.tag}**'s birthday has been set to **${result.birthday}**.`);
            }
        } catch (error) {
            console.error(error);
            return interaction.editReply('❌ Something went wrong while saving the birthday.');
        }
    }
};