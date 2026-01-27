import { SlashCommandBuilder } from 'discord.js';
import { getAllUsers } from '../db/userUtils.js';

export default {
    data: new SlashCommandBuilder()
        .setName('listbirthday')
        .setDescription(`List all users and their birthdays in this server`),

    async execute(interaction) {
        console.log('List all birthday');
        await interaction.deferReply();

        const MONTHS = [
          'January', 'February', 'March', 'April',
          'May', 'June', 'July', 'August',
          'September', 'October', 'November', 'December'
        ];
        const monthBuckets = Array.from({ length: 12 }, () => []);


        try {
            const users = await getAllUsers(interaction.guild.id);
            if(!users || users.length === 0) {
                return interaction.editReply(`😔 No information found for this server`);
            }
            let reply = `🔖 Here's the list of all recorded birthdays: \n`;

            for (const user of users) {
                if (!user.birthday) continue;

                const date = new Date(user.birthday);
                const month = date.getMonth(); // 0–11
                const day = date.getDate();

                monthBuckets[month].push({ userId: user.userId, day});
            }

            for (let i = 0; i < 12; i++) {
                const bucket = monthBuckets[i];
                if (bucket.length === 0) continue;

                reply += `\n**${MONTHS[i]}**\n`;

                for (const entry of bucket) {
                    let userTag;
                    try {
                        const member = await interaction.guild.members.fetch(entry.userId);
                        userTag = member.user.username;
                    } catch {
                        userTag = `(Inactive) ${entry.userId}`;
                    }

                reply += `• ${userTag} — ${MONTHS[i].slice(0, 3)} ${entry.day}\n`;
              }
            }

            await interaction.editReply(reply);
        } catch (error) {
            console.error(error);
            return interaction.editReply('❌ Something went wrong while fetching the list of birthdays.');
        }
    }
};