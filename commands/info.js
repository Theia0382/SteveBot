const { SlashCommandBuilder } = require( '@discordjs/builders' );

module.exports =
{
    data : new SlashCommandBuilder( )
        .setName( '정보' )
        .setDescription( '사용자나 서버의 정보를 불러옵니다.' )

        .addSubcommand( subcommand => subcommand
            .setName( '사용자' )
            .setDescription( '사용자에 대한 정보' )
            .addUserOption( option => option
                .setName( '목표' )
                .setDescription( '사용자 지정' )
                .setRequired( true ) ) )

        .addSubcommand( subcommand => subcommand
            .setName( '서버' )
            .setDescription( '서버에 대한 정보' ) ),
    async execute( interaction )
    {
        if ( interaction.options.getSubcommand( ) == '사용자' )
        {
            const user = interaction.options.getUser( '목표' );

            await interaction.reply( `사용자 이름 : ${user.username}\n사용자 ID : ${user.id}` );
        }
        else if ( interaction.options.getSubcommand( ) == '서버' )
        {
            await interaction.reply( `서버 이름 : ${interaction.guild.name}\n총 구성원 : ${interaction.guild.memberCount}명` );
        }
    }
};