const fs = require( 'fs' );

fs.readFile( 'data.json', 'utf8', ( error, data ) =>
{
	if ( error )
    {
    	throw error;
    }

    console.log( data, '\n\n' );

    var serverName = JSON.parse( data ).description.text;
    var serverVersion = JSON.parse( data ).version.name;
    var onlinePlayer = JSON.parse( data ).players.online;
    var maxPlayer = JSON.parse( data ).players.max;

    console.log
    (
        `서버 이름 : ${serverName}`,
        `\n서버 버전 : ${serverVersion}`,
        `\n접속한 플레이어 : ${onlinePlayer}/${maxPlayer}`
    );

} );