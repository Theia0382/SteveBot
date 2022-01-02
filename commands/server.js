const { SlashCommandBuilder } = require( '@discordjs/builders' );
const { rejects } = require('assert');
const Discord = require( 'discord.js' );
const https = require( 'https' );
const { resolve } = require('path');

module.exports =
{
    data : new SlashCommandBuilder( )
        .setName( '서버' )
        .setDescription( '서버 정보를 보여줍니다.' ),

    async execute( interaction )
    {
        await interaction.deferReply( );

        const url = "https://minecraft-api.com/api/ping/raptureax.asuscomm.com/5400/json";

        await https.get( url, response => 
        {
            response.setEncoding( 'utf8' );

            response.on( 'data', data =>
            {
                console.log( data );

                let serverUser;
                let state;

                if ( data.startsWith( 'Failed' ) ) 
                {
                    state = '닫힘'; serverUser = '0/10';
                }
                else
                { 
                    state = '열림';
                    
                    const serverUserNumber = data.slice( 74, 75 );
                    if ( serverUserNumber == 0 )
                    {
                        serverUser = '0/10'
                    }
                    else
                    {
                        serverUser = `${serverUserNumber}/10`
                    }
                }
            
                const Embed = new Discord.MessageEmbed( )
                    .setColor( '#4432a8' )
                    .setAuthor( 
                        { 
                            name : 'Minecraft Server' ,
                            iconURL : 'https://cdn.discordapp.com/attachments/765391514377388082/927147081192337469/minecraft-icon.png' 
                        } )
                        .setTitle( '서버 정보' )
                        .setDescription( '서버 주소 :\nraptureax.asuscomm.com:5400\n' )
                        .addField( '서버 상태' , `${state}` )
                        .addField( '접속 중' , `${serverUser}` )
                        .setTimestamp( );
                interaction.editReply( { embeds: [ Embed ] } );
                return;
            } );
        } );
    }
};