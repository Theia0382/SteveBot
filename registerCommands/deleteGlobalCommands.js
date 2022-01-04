const { REST } = require( '@discordjs/rest' );
const { Routes } = require( 'discord-api-types/v9' );
const { clientID, guildID, token } = require( './config.json' );

const commands = [ ].map( command => command.toJSON)

const rest = new REST( { version : '9' } ).setToken( token );

( async ( ) =>
{
    try
    {
        console.log( '봇 전역 명령 삭제 시도' );

        await rest.put( Routes.applicationCommands( clientID ), { body : commands } );

        console.log( '봇 전역 명령 삭제 성공');
    }
    catch ( error )
    {
        console.error( error );
    }
} )( );
