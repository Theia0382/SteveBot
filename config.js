const fs = require( 'fs' );

function editObject( object, address, value )
{
    const key = address.split( '.' );

    let objectCache = [ ];

    for ( i = 0; i < key.length; i++ )
    {
        objectCache[ i ] = object;
        object = object[ key[ i ] ];
    }

    object = value;
    
    for ( i = key.length - 1; i > -1; i-- )
    {
        objectCache[ i ][ key[ i ] ] = object;
        object = objectCache[ i ];
    }

    return object;
}

const get = function( address )
{
    const data = fs.readFileSync( './config.json', 'utf8', ( error ) =>
    {
        if ( error )
        {
            throw error;
        }
    } );

    let config = JSON.parse( data );

    const key = address.split( '.' );

    for ( i = 0; i < key.length; i++ )
    {
        config = config[ key[ i ] ];
    }

    return config;
}

const edit = function( address, value )
{
    let data = fs.readFileSync( './config.json', 'utf8', ( error ) =>
    {
        if ( error )
        {
            throw error;
        }
    } );

    let config = JSON.parse( data );
    config = editObject( config, address, value );

    data = JSON.stringify( config );
    fs.writeFileSync( './config.json', data, 'utf8', ( error ) =>
    {
        if ( error )
        {
            throw error;
        }
    } );
}

module.exports = { get, edit }