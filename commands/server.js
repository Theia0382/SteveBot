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

            if ( data.startsWith( 'Failed' ) ) 
            {
                const state = '닫힘';
            }
            else
            { 
                const state = '열림';
                const serverName = JSON.parse( data ).description.text;
                const maxUser = JSON.parse( data ).players.max;
                const onlineUser = JSON.parse( data ).players.online;
                const serverVersion = JSON.parse( data ).version.name;
            }
        
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
                .setDescription( `서버 주소 :\n${serverAddress}\n` )
                .addField( '서버 상태' , `${state}` );

            if ( state === '열림' )
            {
                Embed
                    .addField( '접속 중' , `${onlineUser}/${maxUser}` )
                    .setFooter( `게임 버전 : ${serverVersion}` );
            }
                            
            interaction.editReply( { embeds: [ Embed.setTimestamp( ) ] } );
            return;
        } );
    }
};