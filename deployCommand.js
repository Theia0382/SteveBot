const fs = require( 'fs' );
const { REST } = require( '@discordjs/rest' );
const { Routes } = require( 'discord-api-types/v9' );
const { clientID, guildID, token } = require( './config.json' );

const commands = [ ];
const commandFiles = fs.readdirSync( './commands' ).filter( file => file.endsWith( '.js' ) );

for ( const file of commandFiles )
{
    const command = require( `./commands/${file}` );
    commands.push( command.data.toJSON( ) );
}

const rest = new REST( { version : '9' } ).setToken( token );

( async ( ) =>
{
    try
    {
        console.log( '앱의 (/) 명령 새로 고침 시작' );

        await rest.put( Routes.applicationCommands( clientID ), { body : commands } );

        console.log( '앱의 (/) 명령 새로 고침 성공');
    }
    catch ( error )
    {
        console.error( error );
    }
} )( );
