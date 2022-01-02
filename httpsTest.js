const https = require( 'https' );

https.get( 'https://minecraft-api.com/api/ping/raptureax.asuscomm.com/5400/json', ( response ) =>
{
    console.log( 'statusCode :', response.statusCode );
    
    response.on( 'data', ( data ) =>
    {
        process.stdout.write( data );
    } );

} ).on('error', ( error ) =>
{
    console.error( error );
} );