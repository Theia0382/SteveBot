const fs = require( 'fs' );

let data = fs.readFileSync( './config.json', 'utf8', ( error ) =>
{
    if ( error )
    {
        throw error;
    }
} );

let config = JSON.parse( data );

// config.json의 정보도 같이 수정되야 할 때 부르는 함수
const editConfig = function( key, value )
{
    config[ key ] = value;

    data = JSON.stringify( config );
    fs.writeFileSync( './config.json', data, 'utf8', ( error ) =>
    {
        if ( error )
        {
            throw error;
        }
    } );
}

module.exports = Object.assign( config, { editConfig } );