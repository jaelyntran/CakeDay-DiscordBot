# CakeDay-DiscordBot
CakeDay is a Discord bot that helps you track and celebrate birthdays in your server. It supports adding, listing, and announcing birthdays automatically. Written in JavaScript with MongoDB integration, currently hosted on Railway. Public hosting is currently limited; full functionality is available when self-hosting.


## Inviting the Bot to the Server 
⚠️ Note: Birthday management commands are restricted by server role configuration. If you invite the hosted bot and need role access enabled, please contact the maintainer.
You can invite the hosted version of this bot directly to your server.

1. Click the invite link: [Invite CakeDay](https://discord.com/oauth2/authorize?client_id=1464000903555190967)

2. Select the server you want to add the bot to.
   
3. Once invited, you can start using the bot's commands in any text channel.


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
ALLOWED_ROLES=roleID1,roleID2  # Comma-separated role IDs allowed to add/remove birthdays
```

6. Deploy slash commands ```node src/deploy-commands.js```

7. Run the Bot ```node src/app.js```

8. (Optional) Maintenance commands:
- To clear all slash commands, run ```node src/clear-commands.js```
- To drop database, run ```node src/db/dropDatabase.js```

## Notes
- All birthday data is stored in MongoDB.
- Global commands may take up to an hour to appear on all servers.
- Only users with roles specified in ALLOWED_ROLES can modify birthday data.
- The bot will not respond in DMs; it only works in servers.
- The bot currently supports one birthday per user per server.


## Commands Reference
/addbirthday → add a user’s birthday (only ALLOWED_ROLES)

/checkbirthday → check a user’s birthday 

/listbirthday → list all birthdays

/removebirthday → remove a user’s birthday (only ALLOWED_ROLES)

/removeuser → remove a user’s document from the database (only ALLOWED_ROLES)

/removeallusers → remove all users' documents from the database for the current server (only ALLOWED_ROLES)

/upcomingbirthday → show the next upcoming birthday

**Birthday Announcements:** CakeDay automatically posts birthday announcements daily in the server’s **system channel**, or if none exists, the **first available text channel** where it has permission to send messages.


## Permissions Required
- Send Messages – To post birthday announcements.
- View Channels - Required so the bot can see channels to send announcements.


## Known Issues / Limitations
- If the bot is restarted or redeployed, birthday announcements may be delayed until the next scheduled check.
- Server timezone handling is based on the system default and may not reflect individual user timezones.
- The bot must have permission to send messages in at least one text channel to post birthday announcements.
- The hosted instance may be unavailable during maintenance or redeployments.


## Takeaway
CakeDay was built to make birthday tracking in Discord servers simple and automated. It demonstrates:
- Practical use of Discord slash commands
- MongoDB schema design for per-server user data
- Role-based access control using Discord role ID
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
