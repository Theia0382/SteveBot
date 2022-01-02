const https = require( 'https' );

module.exports =
{
    name : 'ready',
    once : true,

    async execute( client )
    {
        console.log( `Ready! Logged in as ${client.user.tag}` );
        client.user.setActivity( 'STEVE READY!' );
        const url = "https://minecraft-api.com/api/ping/raptureax.asuscomm.com/5400/json";
        setInterval( function( )
        {
            https.get( url, response => 
            {
                response.setEncoding('utf8');
                response.on('data', data =>
                {
                    if ( data.startsWith( 'Failed' ) ) 
                    {
                        client.user.setActivity( '서버 닫힘' );
                    }
                    else
                    {
                        client.user.setActivity( '서버 열림' );
                    }
                } );
            } );
        }, 10000 );
    }
};