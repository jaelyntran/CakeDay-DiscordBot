import { SlashCommandBuilder } from 'discord.js';
import { getNextBirthday } from '../db/userUtils.js';

export default {
    data: new SlashCommandBuilder()
        .setName('upcomingbirthday')
        .setDescription(`Show the server's upcoming birthday'`),

    async execute(interaction) {
        console.log('Display upcoming birthday');
        await interaction.deferReply();

        try {
           const users = await getNextBirthday(interaction.guild.id);
           if (!users) {
            return interaction.editReply(`No information found for this server.`);
           } else {
                let reply = `⏳ Here's the upcoming birthday(s):`;
                for(const cur of users) {
                    let userTag;
                    try {
                        const member = await interaction.guild.members.fetch(cur.user.userId);
                        userTag = member.user.tag;
                    } catch {
                        userTag = `(Inactive) ${user.userId}`;
                    }
                    const bday = new Date(cur.nextBirthday);
                    const bdayStr = `${String(bday.getMonth()+1).padStart(2,'0')}-${String(bday.getDate()).padStart(2,'0')}`;

                    reply += `\n📅 **${userTag}** on ${bdayStr}`;
                }
                interaction.editReply(reply);
           }
        } catch (error) {
            console.error(error);
            return interaction.editReply('❌ Something went wrong while fetching the next birthday(s).');
        }
    }
};