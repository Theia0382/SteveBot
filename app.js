const fs = require( 'fs' );
const { Client, Collection, Intents } = require( 'discord.js' );
const config = require( './config' );

const client = new Client( { intents : [ Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES ] } );

// events 폴더의 이벤트 등록
const eventFiles = fs.readdirSync( './events' ).filter( ( file ) => file.endsWith( '.js' ) );
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

// commands 폴더의 이벤트 등록
client.commands = new Collection( );
const commandFiles = fs.readdirSync( './commands' ).filter( ( file ) => file.endsWith( '.js' ) );
for ( const file of commandFiles )
{
    const command = require( `./commands/${file}` );
    client.commands.set( command.data.name, command );
}

client.login( config.token );