# CakeDay-DiscordBot
CakeDay is a Discord bot that helps you track and celebrate birthdays in your server. It supports adding, listing, and announcing birthdays automatically. Written in JavaScript with MongoDB integration, currently hosted on Railway. 


## Inviting the Bot to the Server 
You can invite the hosted version of this bot directly to your server.

1. Click the invite link: [Invite CakeDay](https://discord.com/oauth2/authorize?client_id=1464000903555190967)

2. Select the server you want to add the bot to.
   
3. Once invited, you can start using the bot's commands in any text channel.

Permissions
- Users with Manage Server or Administrator permissions can add, remove, and manage birthdays.
- All other users can view birthday information.

## Self-Host the Bot

If you want to run your own copy of the bot:

1. Clone the repository ```git clone https://github.com/jaelyntran/CakeDay-DiscordBot```
   
2. After cloning, navigate to the new directory ```cd CakeDay-DiscordBot```

3. Check if node exists by running ```node -v```. If not installed:
- Download Node.js from nodejs.org (LTS version recommended).
- Follow the installer instructions (npm is bundled with Node.js).

4. Install all required packages listed in the package.json file ```npm install```
   
5. Set up environment variables
Create a .env file in the project root with the following:
```env
APP_ID=your-app-id           # Discord application ID
GUILD_ID=your-guild-id       # Optional: for testing in one server
DISCORD_TOKEN=your-bot-token
PUBLIC_KEY=your-public-key   # For verifying interactions
MONGO_URI=your-mongodb-connection-string
```

6. Deploy slash commands ```node src/deploy-commands.js```

7. Run the Bot ```node src/app.js```

8. (Optional) Maintenance commands:
- To clear all slash commands, run ```node src/clear-commands.js```
- To drop database, run ```node src/db/dropDatabase.js```


## Notes
- All birthday data is stored in MongoDB.
- Global slash commands may take up to an hour to appear on all servers.
- The bot only works in servers; it does not respond in DMs.
- Each user can have only one birthday per server.


## Commands Reference
/addbirthday → Add a user’s birthday (requires Manage Server/Admin)

/checkbirthday → Check a user’s birthday 

/listbirthday → List all birthdays

/removebirthday → Remove a user’s birthday (requires Manage Server/Admin)

/removeuser → Remove a user’s document from the database (requires Manage Server/Admin)

/removeallusers → Remove all users' documents for the current server (requires Manage Server/Admin)

/upcomingbirthday → Show the next upcoming birthday

**Birthday Announcements:** CakeDay automatically posts birthday announcements daily in the server’s **system channel**, or if none exists, the **first available text channel** where it has permission to send messages.


## Permissions Required
- Send Messages – To post birthday announcements.
- View Channels - Required so the bot can see channels to send announcements.


## Known Issues / Limitations
- Birthday announcements may be delayed after bot restarts or redeploys.
- Server timezone handling is based on system default and may not reflect individual user timezones.
- The hosted instance may be temporarily unavailable during maintenance or redeployments.


## Takeaway
CakeDay was built to make birthday tracking in Discord servers simple and automated. It demonstrates:
- Practical use of Discord slash commands
- MongoDB schema design for per-server user data
- Permission-based authorization using Discord’s native server permissions
- Background task logic for scheduled announcements
- Deployment and environment management using Railway

The project is designed to be easy to self-host, extend, and customize for different server needs.


## Credits / Acknowledgements
- discord.js → Discord bot library
  https://discord.js.org/
- MongoDB & Mongoose — Database and object modeling
  https://www.mongodb.com/
  https://mongoosejs.com/
- Railway — Hosting and deployment platform
  https://railway.app/
- Node.js — JavaScript runtime
  https://nodejs.org/
