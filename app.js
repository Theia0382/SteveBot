const fs = require( 'fs' );
const { Client, Collection, Intents } = require( 'discord.js' );
const { token } = require( './config.json' );

const client = new Client( { intents : [ Intents.FLAGS.GUILDS ] } );

const eventFiles = fs.readdirSync( './events' ).filter( file => file.endsWith( '.js' ) );

for ( const file of eventFiles )
{
    const event = require( `./events/${file}` );
    
    if ( event.once )
    {
        client.once( event.name, ( ...arg ) => event.execute( ...arg ) );
    }
    else
    {
        client.on( event.name, ( ...arg ) => event.execute( ...arg ) );
    }
}

client.commands = new Collection( );
const commandFiles = fs.readdirSync( './commands' ).filter( file => file.endsWith( '.js' ) );

for ( const file of commandFiles )
{
    const command = require( `./commands/${file}` );
    client.commands.set( command.data.name, command );
}

client.on( 'interactionCreate', async interaction =>
{
    console.log( `${interaction.user.tag} in #${interaction.channel.name} triggered an interaction.` );

	if ( !interaction.isCommand( ) )
    {
        return;
    }

	const command = client.commands.get( interaction.commandName );

    if ( !command )
    {
        return;
    }

    try
    {
        await command.execute( interaction );
    }
    catch ( error )
    {
        console.error( error );
        await interaction.reply( { content : '명령을 실행하던 중 에러가 발생했습니다!', ephemeral : true } );
    }
} );

client.login( token );