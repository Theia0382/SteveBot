const fs = require( 'node:fs' );
const path = require( 'node:path' );

function getJSON( name )
{
    const filePath = path.join( __dirname, `../data/${ name }.json` )

    if ( fs.existsSync( filePath ) )
    {
        const temp = fs.readFileSync( filePath );
        const data = JSON.parse( temp );
        return data;
    }
    else
    {
        fs.writeFileSync( filePath, '{}' );
        return { };
    }
}

function updateJSON( name, data )
{
    const filePath = path.join( __dirname, `../data/${ name }.json` )

    const temp = JSON.stringify( data );
    fs.writeFileSync( filePath, temp );
}

module.exports =
{
    getJSON,
    updateJSON
};