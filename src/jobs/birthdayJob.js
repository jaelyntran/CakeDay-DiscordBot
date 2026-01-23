import Server from '../models/Server.js';
import User from '../models/User.js';

export function startBirthdayJob(client) {
    runBirthdayCheck(client);
    setInterval(() => runBirthdayCheck(client), 60 * 60 * 1000);
}

async function runBirthdayCheck(client) {
    const today = new Date();
    const todayKey = today.toISOString().slice(0, 10); // YYYY-MM-DD

    for (const guild of client.guilds.cache.values()) {
        try {
            let server = await Server.findOne({ serverId: guild.id });
            if (!server) {
                server = await Server.create({ serverId: guild.id });
            }

            if (server.lastBirthdayAnnouncement === todayKey) continue;

            const users = await User.find({
                serverId: guild.id,
                birthday: { $ne: null }
            });

            const birthdayUsers = users.filter(user => {
                const birthday = new Date(user.birthday);
                return (
                    birthday.getMonth() === today.getMonth() &&
                    birthday.getDate() === today.getDate()
                );
            });

            if (birthdayUsers.length === 0) continue;

            const channel = guild.systemChannel;
            if (!channel) {
                const textChannels = guild.channels.cache
                        .filter(c => c.isTextBased() && c.permissionsFor(client.user).has('SendMessages'))
                        .sort((a, b) => a.position - b.position); // pick the topmost channel
                    if (textChannels.size === 0) continue; // no channel available
                    channel = textChannels.first();
            };

            const mentions = [];
            for (const user of birthdayUsers) {
                try {
                    const member = await guild.members.fetch(user.userId);
                    mentions.push(`<@${member.id}>`);
                } catch {}
            }

            if (mentions.length === 0) continue;

            await channel.send(
                `🎉 **Happy Birthday!** 🎂\n${mentions.join(' ')}`
            );

            server.lastBirthdayAnnouncement = todayKey;
            await server.save();
        } catch (err) {
            console.error(`Birthday job error (${guild.id}):`, err);
        }
    }
}