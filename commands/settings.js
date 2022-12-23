const { SlashCommandBuilder } = require( 'discord.js' );
const Server = require( '../modules/server.js' );

module.exports =
{
	data : new SlashCommandBuilder( )
		.setName( 'settings' )
		.setDescription( '설정' )
        .addSubcommandGroup( subcommandgroup => subcommandgroup
            .setName( 'server' )
            .setDescription( '서버 관련 설정' )
            .addSubcommand( subcommand => subcommand
                .setName( 'register' )
                .setDescription( '서버를 등록합니다.' )
                .addStringOption( option => option
                    .setName( 'address' )
                    .setDescription( '서버 주소를 입력해주세요' )
                    .setRequired( true ) ) ) ),
	async execute( interaction )
    {
		await interaction.deferReply( );

        if ( interaction.options.getSubcommandGroup( ) == 'server' )
        {
            if ( interaction.options.getSubcommand( ) == 'register' )
            {
                const server = new Server( interaction.guildId );

                const address = interaction.options.getString( 'address' )
                server.register( address );

                await interaction.editReply( `서버가 등록되었습니다. 주소: ${ address }` );
            }
        }
	}
};