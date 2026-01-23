import { SlashCommandBuilder } from 'discord.js';
import { getAllUsers } from '../db/userUtils.js';

export default {
    data: new SlashCommandBuilder()
        .setName('listbirthday')
        .setDescription(`List all users and their birthdays in this server`);

    async execute(interaction) {
        console.log('List all birthday');
        await interaction.deferReply({ ephemeral: true });

        try {
            const users = await getAllUsers(interaction.guild.id);
            if(!users) {
                return interaction.editReply(`No information found for this server.`);
            }
            let reply = `🎉 Here's the list of all recorded birthdays: `;
            for(const user of users) {
                let userTag;
                try {
                    const member = await interaction.guild.members.fetch(user.userId);
                    userTag = member.user.tag;
                } catch {
                    userTag = `(Inactive) ${user.userId}`;
                }

                if (user.birthday) {
                    const bday = new Date(user.birthday);
                    const bdayStr = `${String(bday.getMonth()+1).padStart(2,'0')}-${String(bday.getDate()).padStart(2,'0')}-${bday.getFullYear()}`;
                    reply += `\n🎂 **${userTag}**'s birthday: **${bdayStr}**`;
                } else {
                    reply += `\n🎂 **${userTag}** has no birthday set`;
                }
            }
            interaction.editReply(reply);
        } catch (error) {
            console.error(error);
            return interaction.editReply('❌ Something went wrong while fetching the list of birthdays.');
        }
    }
};