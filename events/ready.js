const fs = require( 'fs' );
const config = require( '../config' );
const Discord = require( 'discord.js' );
const getServerInfo = require( '../modules/getServerInfo' );

function cacheServerInfo( client )
{
    getServerInfo( ( error, data ) =>
    {
        const cachedData = fs.readFileSync( `${config.get( 'cacheUrl' )}/serverInfo.json`, 'utf8' );

        const parsedCachedData = JSON.parse( cachedData );

        let parsedData;

        if ( !error )
        {
            parsedData = JSON.parse( data );
            parsedData[ 'serverOpen' ] = true;

            client.user.setActivity( `서버 열림 (${parsedData.players.online}/${parsedData.players.max})` );
        
            if ( config.get( 'notification.on' ) && config.get( 'notification.channel.id' ) && parsedData.players.online > parsedCachedData.players.online )
            {
                let playerList = parsedData.players.sample;
                const cachedPlayerList = parsedCachedData.players.sample;
                let newPlayerList = [ ];

                if ( !cachedPlayerList )
                {
                    for ( i = 0; i < playerList.length; i++ )
                    {
                        newPlayerList.push( playerList[ i ].name );
                    }
                }
                else
                {
                    let cachedIDList = [ ];
                    for ( i = 0; i < cachedPlayerList.length; i++ )
                    {
                        cachedIDList.push( cachedPlayerList[ i ].id );
                    }

                    for ( i = 0; i < playerList.length; i++ )
                    {
                        if ( !cachedIDList.includes( playerList[ i ].id ) )
                        {
                            newPlayerList.push( playerList[ i ].name );
                        }
                    }
                }

                let message = '';
                for ( i = 0; i < newPlayerList.length; i++ )
                {
                    message = message + `\n플레이어 **${newPlayerList[ i ]}**이 서버에 접속하였습니다.`
                }

                const Embed = new Discord.MessageEmbed( )
		            .setColor( '#ff6600' )
		            .setAuthor(
                    { 
		            	name : '서버 알림' ,
		            	iconURL : 'https://cdn.discordapp.com/attachments/765391514377388082/927147081192337469/minecraft-icon.png'
		            } )
		            .setTitle( '플레이어 접속' )
                    .setDescription( message )
                client.channels.cache.get( config.get ( 'notification.channel.id' ) ).send( { embeds: [ Embed ] } );
            }
        }
        else 
        {
            parsedData = parsedCachedData;
            parsedData[ 'serverOpen' ] = false;

            client.user.setActivity( '서버 닫힘' );
        }

        data = JSON.stringify( parsedData );

        fs.writeFile( `${config.get( 'cacheUrl' )}/serverInfo.json`, data, 'utf8' );
    } );
}

module.exports =
{
    name : 'ready',
    once : true,

    async execute( client )
    {
        console.log( `Ready! Logged in as ${client.user.tag}` );
        client.user.setActivity( 'STEVE LODING!' );
        setInterval( ( ) =>
        {
            cacheServerInfo( client );
        }, 10000 );
    }
};