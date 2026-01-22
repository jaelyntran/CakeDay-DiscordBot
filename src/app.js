import 'dotenv/config';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Client, Collection, GatewayIntentBits } from 'discord.js';
import { MongoClient, ServerApiVersion } from "mongodb";

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);
const discordClient = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

discordClient.commands = new Collection();

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(f => f.endsWith('.js'));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    console.log(filePath);
    const commandModule = await import(`file://${filePath}`);
    const command = commandModule.default || commandModule;
    if (command.data && command.execute) {
        discordClient.commands.set(command.data.name, command);
    } else {
        console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
    }
}

const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(f => f.endsWith('.js'));

for (const file of eventFiles) {
  const filePath = path.join(eventsPath, file);
  console.log(filePath);
  const eventModule = await import(`file://${filePath}`);
  const event = eventModule.default || eventModule;

  if (event.once) {
    discordClient.once(event.name, (...args) => event.execute(...args, discordClient));
  } else {
    discordClient.on(event.name, (...args) => event.execute(...args, discordClient));
  }
}

const mongoClient = new MongoClient(process.env.MONGO_URI, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run () {
    try {
        await mongoClient.connect();
        await mongoClient.db("monshoo").command({ ping: 1 });
        console.log("Successfully connected to MongoDB!");
    } catch {
        console.error("MongoDB ping failed:", err);
    }
}
run();

discordClient.login(process.env.DISCORD_TOKEN);