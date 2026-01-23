import User from '../models/User.js';

async function getOrCreateUser(userId, serverId) {
    let user = await User.findOne({userId, serverId});
    if(!user) {
        user = new User({userId, serverId});
        await user.save();
    }
    return user;
};

async function getBirthday(userId, serverId) {
    const user = await User.findOne({ userId, serverId });
    return user || null;
}

async function setBirthday(userId, serverId, birthday) {
    const user = await getOrCreateUser(userId, serverId);
    user.birthday = birthday;
    await user.save();
    return user;
}

async function deleteBirthday(userId, serverId) {
    const user = await getOrCreateUser(userId, serverId);
    if(user.birthday) {
        user.birthday = null;
        await user.save();
    }
    return user;
}

async function deleteDocument(userId, serverId) {
    const user = await User.findOneAndDelete({ userId, serverId });
    return user;
}

export {getOrCreateUser, getBirthday, setBirthday, deleteBirthday, deleteDocument};