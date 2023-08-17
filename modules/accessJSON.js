const fs = require( 'node:fs' );

function getJSON( filePath )
{
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

function updateJSON( filePath, data )
{
    const temp = JSON.stringify( data );
    fs.writeFileSync( filePath, temp );
}

module.exports =
{
    getJSON,
    updateJSON
};