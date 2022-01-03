const https = require( 'https' );
const fs = require( 'fs' );

let serverOpen;
const cacheUrl = './cache/serverInfo.json';

async function getServerInfo( )
{
    let url = "https://minecraft-api.com/api/ping/raptureax.asuscomm.com/5400/json";
    https.get( url, ( response ) => 
    {
        response.setEncoding( 'utf8' );
        response.on( 'data', ( data ) =>
        {
            if ( data.startsWith( 'Failed' ) )
            {
                serverOpen = false;
                
                fs.readFile( cacheUrl, 'utf8', ( error, data ) =>
                {
                    if ( error )
                    {
                        throw error;
                    }

                    let parsedData = JSON.parse( data );
                    parsedData[ 'serverOpen' ] = false;
                    data = JSON.stringify( parsedData );

                    fs.writeFile( cacheUrl, data, 'utf8', ( error ) =>
                    {
                        if ( error )
                        {
                            throw error;
                        }
                    } );
                } );
            }
            else 
            {
                serverOpen = true;

                let parsedData = JSON.parse( data );
                parsedData[ 'serverOpen' ] = true;
                data = JSON.stringify( parsedData );

                fs.writeFile( cacheUrl, data, 'utf8', ( error ) =>
                {
                    if ( error )
                    {
                        throw error;
                    }
                } );
            }
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
        await getServerInfo( );
        setInterval( ( ) =>
        {
            getServerInfo( );

            if ( serverOpen ) 
            {
                client.user.setActivity( '서버 열림' );
            }
            else
            {
                client.user.setActivity( '서버 닫힘' );
            }
        }, 10000 );
    }
};