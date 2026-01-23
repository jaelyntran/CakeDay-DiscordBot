import 'dotenv/config';
import { SlashCommandBuilder } from 'discord.js';
import { deleteDocument } from '../db/userUtils.js';

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
        const allowedRoles = process.env.ALLOWED_ROLES.split(',').map(id => id.trim());;
        const memberRoleIds = interaction.member.roles.cache.map(role => role.id);
        const hasPermission = memberRoleIds.some(id => allowedRoles.includes(id));

        if (!hasPermission) {
            return interaction.reply({
                content: '❌ You do not have permission to run this command.',
                ephemeral: true
            });
        }

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
        } catch (error) {
            console.error(error);
            return interaction.editReply('❌ Something went wrong while removing the user.');
        }
    }
};