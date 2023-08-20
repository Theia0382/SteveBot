const { Events, EmbedBuilder, AttachmentBuilder } = require( 'discord.js' );
const { getJSON, updateJSON } = require( '../modules/accessJSON.js' );
const Server = require( '../modules/server.js' );
const path = require( 'node:path' );

const serverAddressPath = path.join( __dirname, '../data/serverAddress.json' );
const serverInfoPath = path.join( __dirname, '../cache/serverInfo.json' );
const notificationConfigPath = path.join( __dirname, '../data/notificationConfig.json' );

function init( client )
{
    const notificationConfig = getJSON( notificationConfigPath );

	for ( guildId of client.guilds.cache.keys( ) )
	{
    	if ( notificationConfig[ guildId ] == null )
		{
			notificationConfig[ guildId ] = 
			{
				'active' : { }
			};
		}

		updateJSON( notificationConfigPath, notificationConfig );
	}
}

function cacheServerInfo( client )
{
	const serverAddress = getJSON( serverAddressPath );
	const serverInfo = getJSON( serverInfoPath );
	const notificationConfig = getJSON( notificationConfigPath );

	for ( guildId in serverAddress )
	{
		const server = new Server( guildId );

		server.getInfo( ( error, info ) =>
		{
			if ( !error )
			{
				if ( notificationConfig[ guildId ]?.active?.newplayers && info.players.online != 0 )
				{
					let players = [ ];
					info.players.sample.forEach( player =>
					{
						players = players.concat( player.name );
					} );

					let newPlayers;
					if ( serverInfo[ guildId ].players.online == 0 )
					{
						newPlayers = players;
					}
					else
					{
						let cachedPlayers = [ ];
						serverInfo[ guildId ].players.sample.forEach( player =>
						{
							cachedPlayers = cachedPlayers.concat( player.name );
						} );

						newPlayers = players.filter( player => !cachedPlayers.includes( player ) );
					}

					if ( newPlayers[ 0 ] != null )
					{
						let message = '';
						for ( i = 0; i < newPlayers.length; i++ )
						{
							message = message + `\n플레이어 **${newPlayers[ i ]}**(이)가 서버에 접속하였습니다.`
						}

						const embed = new EmbedBuilder( )
							.setColor( 0xFF6600 )
							.setAuthor(
							{ 
								name : '서버 알림'
							} )
							.setTitle( '플레이어 접속' )
							.setDescription( message )
							.setTimestamp( );

						client.channels.cache.get( notificationConfig[ guildId ].channel ).send( { embeds: [ embed ] } );
					}
				}

				serverInfo[ guildId ] = info;
				updateJSON( serverInfoPath, serverInfo )
			}
		} );
	}
}

module.exports =
{
	name: Events.ClientReady,
	once: true,
	async execute( client )
    {
		console.log( `Ready! Logged in as ${ client.user.tag }` );

		init( client );

		setInterval( ( ) => 
		{
			cacheServerInfo( client );
		}, 30000 );
	}
};