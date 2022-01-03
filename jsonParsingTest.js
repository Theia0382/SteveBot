const fs = require( 'fs' );

fs.readFile( './cache/serverInfo.json', 'utf8', ( error, data ) =>
{
	if ( error )
    {
    	throw error;
    }

    console.log( data, '\n\n' );

    const parsedData = JSON.parse( data );

    console.log( parsedData, '\n\n' );

    const serverName = parsedData.description.text;
    const serverVersion = parsedData.version.name;
    const onlinePlayer = parsedData.players.online;
    const maxPlayer = parsedData.players.max;

    console.log
    (
        `서버 이름 : ${serverName}`,
        `\n서버 버전 : ${serverVersion}`,
        `\n접속한 플레이어 : ${onlinePlayer}/${maxPlayer}`
    );

} );