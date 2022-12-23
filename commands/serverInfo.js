const { SlashCommandBuilder, EmbedBuilder, Guild } = require( 'discord.js' );
const Server = require( '../modules/server.js' );

module.exports =
{
	data : new SlashCommandBuilder( )
		.setName( 'serverinfo' )
		.setDescription( '서버 정보를 표시합니다.' ),
	async execute( interaction )
    {
		await interaction.deferReply( );

        const server = new Server( interaction.guildId );

        server.once( 'data', ( data ) =>
        {
            const embed = new EmbedBuilder( )
                .setColor( 0x4432A8 )
                .setTitle( '서버 정보' )
                .addFields(
                    { name : '서버 설명', value : data.description.text },
                    { name : '서버 주소', value : server.getAddress( ) },
                    { name : '접속 중', value : `${ data.players.online }/${ data.players.max }` }
                )
                .setFooter( { text : `서버 버전 : ${ data.version.name }` } )
                .setTimestamp( );

            if ( data.players.online > 0 )
            {
                let userList = '';
                for ( let i = 0; i < data.players.online; i++ )
                {
                    if ( i > 0 )
                    {
                        userList += '\n';
                    }
                    userList += data.players.sample[ i ].name;
                }

                embed.addFields( { name : '플레이어 목록', value : userList } );
            }
            
            interaction.editReply( { embeds : [ embed ] } );
        } );

        server.on( 'error', ( error ) =>
        {
            console.log( `Error: ${ error.message }` );
            if ( error.code == 'NOADDRESS' )
            {
                interaction.editReply( `등록된 서버가 없습니다. \`/settings 서버 등록\` 으로 서버를 등록할 수 있습니다.` );
            }
            else
            {
                interaction.editReply( `서버가 꺼져있거나 존재하지 않습니다. 주소: ${ server.getAddress( ) }\n\`/settings 서버 등록\` 으로 서버를 등록할 수 있습니다.` );
            }
        } );

        server.getInfo( );
	}
};