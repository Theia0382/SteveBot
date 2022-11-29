const { SlashCommandBuilder } = require( '@discordjs/builders' );
const serverInfo = require( '../modules/showServerInfo' );
const config = require( '../config' );
const isAdmin = require( '../modules/adminChecker' );

module.exports =
{
    data : new SlashCommandBuilder( )
        .setName( '서버' )
        .setDescription( '서버 명령' )
        .addSubcommand( subcommand => subcommand
            .setName( '정보' )
            .setDescription( '서버 정보를 표시합니다.' ) )
        .addSubcommandGroup( subcommandGroup => subcommandGroup
            .setName( '설정' )
            .setDescription( '서버 설정' )
            .addSubcommand( subcommand => subcommand
                .setName( '서버_주소' )
                .setDescription( '서버 주소를 재설정합니다.' )
                .addStringOption( option => option
                    .setName( '새_주소' )
                    .setDescription( '재설정할 주소를 입력하세요.' )
                    .setRequired( true ) ) ) ),

    async execute( interaction )
    {
        if ( interaction.options.getSubcommand( ) == '정보' )
        {
            showServerInfo( interaction );
        }
        else if ( interaction.options.getSubcommandGroup( ) == '설정' )
        {
            if ( !isAdmin( interaction ) )
            {
                await interaction.reply( { content : '관리자만 사용 가능한 명령입니다.', ephemeral : true } )
                return;
            }
            
            if ( interaction.options.getSubcommand( ) == '서버_주소' )
            {
                await interaction.deferReply( );
                await config.edit( 'serverAddress', interaction.options.getString( '새_주소' ) )
                interaction.editReply( `서버 주소가 ${config.get( 'serverAddress' )}로 재설정되었습니다.`);
                console.log( `서버 주소가 ${config.get( 'serverAddress' )}로 재설정되었습니다` );
            }
        }
    }
};