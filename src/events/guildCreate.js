import { getOrCreateUser } from '../db/userUtils.js';

export default {
    name: 'guildCreate',
    once: false,
    async execute(guild, client) {
        console.log(`✅ Joined new server: ${guild.name} (${guild.id})`);
