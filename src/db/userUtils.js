import User from '../models/User.js';
import { PermissionsBitField } from 'discord.js';

export async function getOrCreateUser(userId, serverId) {
    let user = await User.findOne({userId, serverId});
    if(!user) {
        user = new User({userId, serverId});
        await user.save();
    }
    return user;
};

export async function getBirthday(userId, serverId) {
    const user = await User.findOne({ userId, serverId });
    return user || null;
}

export async function setBirthday(userId, serverId, birthday) {
    const user = await getOrCreateUser(userId, serverId);
    user.birthday = birthday;
    await user.save();
    return user;
}

export async function getAllUsers(serverId) {
    const users = await User.find({serverId});
    return users;
}

export async function getNextBirthday(serverId) {
    const today = new Date();
    const users = await User.find({serverId, birthday: { $ne: null }});

    if (users.length === 0) return null;

    const nextBirthdays = users.map(user => {
        const birth = user.birthday;
        let next = new Date(today.getFullYear(), birth.getMonth(), birth.getDate());

        if(next < today) {
            next.setFullYear(next.getFullYear() + 1);
        }

        return { user, nextBirthday: next };
    });

    nextBirthdays.sort((a, b) => a.nextBirthday - b.nextBirthday);
    const earliestDate = nextBirthdays[0].nextBirthday;
    const upcoming = nextBirthdays.filter(user => user.nextBirthday.getTime() === earliestDate.getTime());
    return upcoming;
}

export async function deleteBirthday(userId, serverId) {
    const user = await getOrCreateUser(userId, serverId);
    if(user.birthday) {
        user.birthday = null;
        await user.save();
    }
    return user;
}

export async function deleteDocument(userId, serverId) {
    const user = await User.findOneAndDelete({ userId, serverId });
    return user;
}

export async function deleteServerDocuments(serverId) {
    const result = await User.deleteMany({ serverId });
    return result;
}

export function requirePermission(interaction) {
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageGuild)
        && !interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
        return interaction.reply({
            content: '❌ You must have **Manage Server** or **Administrator** permission to use this command.',
            ephemeral: true,
        });
    }
    return true;
}

