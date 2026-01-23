import { SlashCommandBuilder } from 'discord.js';
import { setBirthday } from '../db/userUtils.js';
import 'dotenv/config';

export default {
    data: new SlashCommandBuilder()
        .setName('addbirthday')
        .setDescription(`Add new user birthday to this server`)
        .addStringOption(option =>
            option.setName('birthday')
                  .setDescription('Birthday in MM-DD-YYYY format (e.g., 08-15-1999)')
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

            const [month, day, year] = bday.trim().split('-').map(Number);
            const date = new Date(year, month - 1, day);
            if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
                return interaction.editReply('Invalid date. Please enter a real date in MM-DD-YYYY format (e.g., 08-15-1999).');
            }
            const result = await setBirthday(user.id, interaction.guild.id, date);
            const bdayStr = `${String(result.birthday.getMonth()+1).padStart(2,'0')}`
                          + `-${String(result.birthday.getDate()).padStart(2,'0')}`
                          + `-${result.birthday.getFullYear()}`;

            if(user.id == interaction.user.id) {
                return interaction.editReply(`🎉 Your birthday has been set to **${bdayStr}**.`);
            } else {
                return interaction.editReply(`🎉 User **${user.tag}**'s birthday has been set to **${bdayStr}**.`);
            }

            const modLogChannel = interaction.guild.channels.cache.get(process.env.MOD_LOG_CHANNEL_ID);
            if (modLogChannel) {
                modLogChannel.send(`[CakeDay] User **${interaction.user.tag}** set **${user.tag}**'s birthday to **${bdayStr}**.`);
            }
        } catch (error) {
            console.error(error);
            return interaction.editReply('❌ Something went wrong while saving the birthday.');
        }
    }
};