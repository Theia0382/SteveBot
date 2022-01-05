const Discord = require( 'discord.js' );
const fs = require( 'fs' );
const config = require( '../config' );

const common = async function( interaction ) 
{
    await interaction.deferReply( );

    fs.readFile( `${config.get( 'cacheUrl' )}/serverInfo.json`, 'utf8', async ( error, data ) =>
    {
        if ( error )
        {
            throw error;
        }

        const parsedData = JSON.parse( data );
        
        let state;
        if ( parsedData[ 'serverOpen' ] == true ) 
        {
            state = '열림';
        }
        else
        { 
            state = '닫힘';
        }
        const serverName = parsedData.description.text;
        const onlineUser = parsedData.players.online;
        const maxUser = parsedData.players.max;
        const serverVersion = parsedData.version.name;
    
        const Embed = await new Discord.MessageEmbed( )
            .setColor( '#4432a8' )
            .setAuthor
            ( 
                { 
                    name : serverName,
                    iconURL : 'https://cdn.discordapp.com/attachments/765391514377388082/927147081192337469/minecraft-icon.png' 
                }
            )
            .setTitle( '서버 정보' )
            .addField( '서버 주소', config.get( 'serverAddress' ) )
            .addField( '서버 상태', state )
            .setFooter( { text : `게임 버전 : ${serverVersion}` } )
            .setTimestamp( );

        if ( parsedData[ 'serverOpen' ] )
        {
            await Embed.addField( '접속 중' , `${onlineUser}/${maxUser}` );
            
            if ( onlineUser > 0 )
            {
                let userList = '';
                for ( let i = 0; i < onlineUser; i++ )
                {
                    userList = await userList + `\n${parsedData.players.sample[ i ].name}`
                }

                await Embed.addField( '플레이어 목록', userList );
            }
        }

        interaction.editReply( { embeds: [ Embed ] } );
    } );
}

module.exports = common;