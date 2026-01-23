import { Events, MessageFlags } from 'discord.js';

export default {
	name: Events.InteractionCreate,
	async execute(interaction) {
	    console.log(`Loaded event: interactionCreate`);
    	if (!interaction.isChatInputCommand()) return;

    	const command = interaction.client.commands.get(interaction.commandName);
         if (!command) {
        	console.error(`No command matching ${interaction.commandName} found.`);
        	return;
        }

		try {
		    console.log(`Execute command: ${interaction.commandName}`);
            await command.execute(interaction);
		} catch (error) {
			console.error(error);
			if (interaction.replied || interaction.deferred) {
            	await interaction.followUp({ content: '❌ There was an error while executing this command!', flags: MessageFlags.Ephemeral });
            } else {
            	await interaction.reply({ content: '❌ There was an error while executing this command!', flags: MessageFlags.Ephemeral });
            }
		}
	},
};