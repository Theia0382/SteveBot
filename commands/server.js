const { SlashCommandBuilder } = require( '@discordjs/builders' );
const Discord = require( 'discord.js' );
const https = require( 'https' );
const fs = require( 'fs' );

const serverAddress = 'raptureax.asuscomm.com:5400'

module.exports =
{
    data : new SlashCommandBuilder( )
        .setName( '서버' )
        .setDescription( '서버 정보를 보여줍니다.' ),

    async execute( interaction )
    {
        await interaction.deferReply( );

        fs.readFile( './cache/serverInfo.json', 'utf8', ( error, data ) =>
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
            const maxUser = parsedData.players.max;
            const onlineUser = parsedData.players.online;
            const serverVersion = parsedData.version.name;
        
            const Embed = new Discord.MessageEmbed( )
                .setColor( '#4432a8' )
                .setAuthor
                ( 
                    { 
                        name : `${serverName}` ,
                        iconURL : 'https://cdn.discordapp.com/attachments/765391514377388082/927147081192337469/minecraft-icon.png' 
                    }
                )
                .setTitle( '서버 정보' )
                .addField( '서버 주소', serverAddress )
                .addField( '서버 상태', state )
                .setFooter( `게임 버전 : ${serverVersion}` )
                .setTimestamp( );

            if ( parsedData[ 'serverOpen' ] )
            {
                Embed.addField( '접속 중' , `${onlineUser}/${maxUser}` );
                
                if ( onlineUser > 0 )
                {
                    let userList = '';
                    for ( let i = 0; i < onlineUser; i++ )
                    {
                        userList = userList + `\n${parsedData[ 'players' ][ 'sample' ][ i ][ 'name' ]}`
                    }
                    console.log( `플레이어 목록${userList}` );

                    Embed.addField( '플레이어 목록', userList );
                }
            }
                            
            interaction.editReply( { embeds: [ Embed ] } );
            return;
        } );
    }
};