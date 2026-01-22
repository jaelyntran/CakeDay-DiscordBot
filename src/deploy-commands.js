import 'dotenv/config';
import { REST, Routes } from 'discord.js';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const commands = [];

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(f => f.endsWith('.js'));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const commandModule = await import(`file://${filePath}`);
    const command = commandModule.default || commandModule;
    if (command.data && command.execute) {
    	commands.push(command.data.toJSON());
    } else {
    	console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
    }
}

const rest = new REST().setToken(process.env.DISCORD_TOKEN);

(async () => {
	try {
        console.log(`Started refreshing ${commands.length} application (/) commands.`);
        if (process.env.GUILD_ID) {
            await rest.put(
                Routes.applicationGuildCommands(process.env.APP_ID, process.env.GUILD_ID),
                { body: commands }
            );
            console.log(`Successfully reloaded ${commands.length} guild commands.`);
        }

        await rest.put(
            Routes.applicationCommands(process.env.APP_ID),
            { body: commands }
        );
        console.log(`Successfully reloaded ${commands.length} global commands.`);
    } catch (err) {
        console.error(err);
    }
})();