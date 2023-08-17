const { SlashCommandBuilder, EmbedBuilder } = require( 'discord.js' );

module.exports =
{
	data : new SlashCommandBuilder()
		.setName( 'mcinfo' )
		.setDescription( '마인크래프트 정보를 검색합니다.' )
        .addSubcommand( subcommand => subcommand
            .setName( 'category' )
            .setDescription( '카테고리를 불러옵니다.' )
            .addStringOption( option => option
                .setName( 'category' )
                .setDescription( '불러올 카테고리를 지정합니다.' )
                .setRequired( true )
                .addChoices(
                    { name : '발전 과제', value : '발전_과제' },
                    { name : '블록', value : '블록' },
                    { name : '아이템', value : '아이템' },
                    { name : '생물 군계', value : '생물_군계' },
                    { name : '마법 부여', value : '마법_부여' },
                    { name : '물약 양조', value : '물약_양조' },
                    { name : '몹', value : '몹' },
                    { name : '거래', value : '거래' }
                ) ) )
        .addSubcommand( subcommand => subcommand
            .setName( 'search' )
            .setDescription( '검색어로 검색합니다.' )
            .addStringOption( option => option
                .setName( 'search_word' )
                .setDescription( '검색어를 지정합니다.' )
                .setRequired( true ) ) ),

	async execute( interaction )
	{
        await interaction.deferReply( );

        let title;
        let searchTarget;
        if ( interaction.options.getSubcommand( ) == 'search' )
        {
            title = interaction.options.getString( 'search_word' );
            searchTarget = title.replace( / /g, '_' );
        }
        else if ( interaction.options.getSubcommand( ) == 'category' )
        {
            searchTarget = interaction.options.getString( 'category' );
            title = searchTarget.replace( /\_/g, ' ' );
        }
        console.log( `검색 : ${title}`)

        const embed = new EmbedBuilder( )
			.setColor( 0x0099FF )
			.setTitle( title )
			.setAuthor(
            { 
				name : 'Minecraft Wiki' ,
				iconURL : 'https://static.wikia.nocookie.net/minecraft_gamepedia/images/e/e6/Site-logo.png'
			} )
			.setURL( `https://minecraft.fandom.com/ko/wiki/${searchTarget}` );
            
		await interaction.editReply( { embeds: [ embed ] } );
	}
};