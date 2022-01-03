const https = require( 'https' );
const fs = require( 'fs' );

let serverInfo;

async function getServerInfo( )
{
    let url = "https://minecraft-api.com/api/ping/raptureax.asuscomm.com/5400/json";
    https.get( url, ( response ) => 
    {
        response.setEncoding( 'utf8' );
        response.on( 'data', ( data ) =>
        {
            fs.writeFile( './cache/serverInfo.json', data, 'utf8', ( error ) =>
            {
                if ( error )
                {
                    throw error;
                }

                serverInfo = data;
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
        client.user.setActivity( 'STEVE READY!' );
        getServerInfo( );
        setInterval( ( ) =>
        {
            getServerInfo( );

            if ( serverInfo.startsWith( 'Failed' ) ) 
            {
                client.user.setActivity( '서버 닫힘' );
            }
            else
            {
                client.user.setActivity( '서버 열림' );
            }
        }, 10000 );
    }
};