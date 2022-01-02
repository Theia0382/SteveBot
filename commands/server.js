const { SlashCommandBuilder } = require( '@discordjs/builders' );
const Discord = require( 'discord.js' );
const https = require( 'https' );

const serverAddress = 'raptureax.asuscomm.com:5400'

module.exports =
{
    data : new SlashCommandBuilder( )
        .setName( '서버' )
        .setDescription( '서버 정보를 보여줍니다.' ),

    async execute( interaction )
    {
        await interaction.deferReply( );

        const url = `https://minecraft-api.com/api/ping/${serverAddress.replace(':', '/')}/json`;

        await https.get( url, response => 
        {
            response.setEncoding( 'utf8' );
            response.on( 'data', data =>
            {
                console.log( data );

                var state;             

                if ( data.startsWith( 'Failed' ) ) 
                {
                    state = '닫힘';
                }
                else
                { 
                    state = '열림';
                    var serverName = JSON.parse( data ).description.text;
                    var maxUser = JSON.parse( data ).players.max;
                    var onlineUser = JSON.parse( data ).players.online;
                    var serverVersion = JSON.parse( data ).version.name;
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
        } );
    }
};