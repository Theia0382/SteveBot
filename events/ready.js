const https = require( 'https' );
const fs = require( 'fs' );
const config = require( '../config' );

function getServerInfo( client )
{
    const url = `https://minecraft-api.com/api/ping/${config.serverAddress.replace(':', '/')}/json`;
    https.get( url, ( response ) => 
    {
        response.setEncoding( 'utf8' );
        response.on( 'data', ( data ) =>
        {
            let parsedData;

            if ( data.startsWith( '{' ) )
            {
                parsedData = JSON.parse( data );
                parsedData[ 'serverOpen' ] = true;

                client.user.setActivity( `서버 열림 (${parsedData.players.online}/${parsedData.players.max})` );
            }
            else 
            {
                data = fs.readFileSync( `${config.cacheUrl}/serverInfo.json`, 'utf8', ( error ) =>
                {
                    if ( error )
                    {
                        throw error;
                    }
                } );

                parsedData = JSON.parse( data );
                parsedData[ 'serverOpen' ] = false;

                client.user.setActivity( '서버 닫힘' );
            }

            data = JSON.stringify( parsedData );

            fs.writeFile( `${config.cacheUrl}/serverInfo.json`, data, 'utf8', ( error ) =>
            {
                if ( error )
                {
                    throw error;
                }
            } );
        } );
    } );
}

module.exports =
{
    name : 'ready',
    once : true,

    async execute( client )
    {
        console.log( `Ready! Logged in as ${client.user.tag}` );
        client.user.setActivity( 'STEVE LODING!' );
        setInterval( ( ) =>
        {
            getServerInfo( client );
        }, 10000 );
    }
};