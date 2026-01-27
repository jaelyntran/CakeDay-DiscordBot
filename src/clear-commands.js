import 'dotenv/config';
import { REST, Routes } from 'discord.js';

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

(async () => {
    await rest.put(
        Routes.applicationGuildCommands(process.env.APP_ID, process.env.GUILD_ID),
        { body: [] }
    );
    console.log(`Guild commands cleared`);

    const data = await rest.get(Routes.applicationCommands(process.env.APP_ID));
    for (const cmd of data) {
        await rest.delete(Routes.applicationCommand(process.env.APP_ID, cmd.id));
        console.log(`Global command ${cmd.name} cleared`);
    }
})();