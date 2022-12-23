require( 'dotenv' ).config( { path: '../.env' } );
const { REST, Routes } = require('discord.js');

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

rest.put(Routes.applicationCommands(process.env.ID), { body: [] })
	.then(() => console.log('Successfully deleted all application commands.'))
	.catch(console.error);