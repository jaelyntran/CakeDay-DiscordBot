import Server from '../models/Server.js';
import User from '../models/User.js';

export function startBirthdayJob(client) {
    runBirthdayCheck(client);
    setInterval(() => runBirthdayCheck(client), 60 * 60 * 1000);
}


function getTodayInTimezone(timezone) {
    const formatter = new Intl.DateTimeFormat('en-CA', {
        timeZone: timezone,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    });

    return formatter.format(new Date());
}


function isBirthdayToday(dateString, timezone) {
    const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: timezone,
        month: 'numeric',
        day: 'numeric'
    });

    const todayParts = formatter.formatToParts(new Date());
    const birthdayParts = formatter.formatToParts(new Date(dateString));

    const todayMonth = todayParts.find(p => p.type === 'month').value;
    const todayDay = todayParts.find(p => p.type === 'day').value;

    const birthMonth = birthdayParts.find(p => p.type === 'month').value;
    const birthDay = birthdayParts.find(p => p.type === 'day').value;

    return todayMonth === birthMonth && todayDay === birthDay;
}


async function runBirthdayCheck(client) {
    for (const guild of client.guilds.cache.values()) {
        try {
            let server = await Server.findOne({serverId: guild.id});
            if (!server) {
                server = await Server.create({
                                serverId: guild.id,
                                timezone: 'America/Los_Angeles' // default
                });
            }

            const timezone = server.timezone || 'America/Los_Angeles';
            const todayStr = getTodayInTimezone(timezone);

            console.log(`Running birthday job for guild: ${guild.id} (${timezone})`);
            console.log("Last run:", server.lastBirthdayAnnouncement, "Today:", todayStr);

            if (server.lastBirthdayAnnouncement === todayStr) continue;

            const users = await User.find({serverId: guild.id, birthday: { $ne: null }});
            const birthdayUsers = users.filter(user =>
                            isBirthdayToday(user.birthday, timezone));

            if (birthdayUsers.length === 0) continue;

            let channel = guild.systemChannel;
            if (!channel) {
                const textChannels = guild.channels.cache
                        .filter(c => c.isTextBased() && c.permissionsFor(client.user)?.has('SendMessages'));

                if (textChannels.size === 0) {
                    console.log(`No writable text channels in guild ${guild.id}`);
                    continue; // skip this guild
                }

                channel = textChannels.sort((a, b) => a.position - b.position).first();
            }
            console.log(`Channel to send announcement: ${channel?.name}`);

            const mentions = [];
            for (const user of birthdayUsers) {
                try {
                    const member = await guild.members.fetch(user.userId);
                    mentions.push(`<@${member.id}>`);
                } catch {}
            }

            if (mentions.length === 0) continue;

            console.log(`Channel to send announcement: ${channel?.name}`);
            await channel.send(
                `🎉 **Happy Birthday!!!** 🎂 ${mentions.join(' ')}`
            );

            server.lastBirthdayAnnouncement = todayStr;
            await server.save();
        } catch (err) {
            console.error(`Birthday job error (${guild.id}):`, err);
        }
    }
}