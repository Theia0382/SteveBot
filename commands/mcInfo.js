const { SlashCommandBuilder } = require( '@discordjs/builders' );
const Discord = require( 'discord.js' );

module.exports = {
	data : new SlashCommandBuilder()
		.setName( '마인크래프트_정보' )
		.setDescription( '마인크래프트 정보를 검색합니다.' )
        .addSubcommand( subcommand => subcommand
            .setName( '카테고리' )
            .setDescription( '카테고리를 불러옵니다.' )
            .addStringOption( option => option
                .setName( '카테고리' )
                .setDescription( '불러올 카테고리를 지정합니다.' )
                .setRequired( true )
                .addChoice( '발전 과제', '발전_과제' )
                .addChoice( '블록', '블록' )
                .addChoice( '아이템', '아이템' )
                .addChoice( '생물 군계', '생물_군계' )
                .addChoice( '마법 부여', '마법_부여' )
                .addChoice( '물약 양조', '물약_양조' )
                .addChoice( '몹', '몹' )
                .addChoice( '거래', '거래' ) ) )    
        .addSubcommand( subcommand => subcommand
            .setName( '검색' )
            .setDescription( '검색어로 검색합니다.' )
            .addStringOption( option => option
                .setName( '검색어' )
                .setDescription( '검색어를 지정합니다.' )
                .setRequired( true ) ) ),

	async execute( interaction )
	{
        let title;
        let searchTarget;
        if ( interaction.options.getSubcommand( ) == '검색' )
        {
            title = interaction.options.getString( '검색어' );
            searchTarget = title.replace( / /g, '_' );
        }
        else if ( interaction.options.getSubcommand( ) == '카테고리' )
        {
            searchTarget = interaction.options.getString( '카테고리' );
            title = searchTarget.replace( /\_/g, ' ' );
        }
        console.log( `검색 : ${title}`)

        const Embed = new Discord.MessageEmbed()
			.setColor( '#0099ff' )
			.setAuthor(
            { 
				name : 'Minecraft Wiki' ,
				iconURL : 'https://static.wikia.nocookie.net/minecraft_gamepedia/images/e/e6/Site-logo.png'
			} )
			.setTitle( title )
			.setURL( `https://minecraft.fandom.com/ko/wiki/${searchTarget}` )
		await interaction.reply( { embeds: [ Embed ] } )
	}
};