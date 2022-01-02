const fs = require( 'fs' );
const { REST } = require( '@discordjs/rest' );
const { Routes } = require( 'discord-api-types/v9' );
const { clientID, guildID, token } = require( './config.json' );

const commands = [ ];
const commandFiles = fs.readdirSync( './commands' ).filter( file => file.endsWith( '.js' ) );

for ( const file of commandFiles )
{
    console.log( `명령 목록에 ${file} 등록 시도` );
    const command = require( `./commands/${file}` );
    commands.push( command.data.toJSON( ) );
    console.log( `명령 목록에 ${file} 등록 성공` );
}

const rest = new REST( { version : '9' } ).setToken( token );

( async ( ) =>
{
    try
    {
        console.log( '봇 서버 명령 새로 고침 시도' );

        await rest.put( Routes.applicationGuildCommands( clientID, guildID ), { body : commands } );

        console.log( '봇 서버 명령 새로 고침 성공');
    }
    catch ( error )
    {
        console.error( error );
    }
} )( );
