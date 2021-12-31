const { SlashCommandBuilder } = require( '@discordjs/builders' );
const { execute } = require('./ping');

module.exports = 
{
    data : new SlashCommandBuilder( )
        .setName( 'echo' )
        .setDescription( '입력을 그대로 답장합니다.' )
        .addStringOption( option => option
            .setName( '입력' )
            .setDescription( '다시 돌려보낼 입력' )
            .setRequired( true ) ),
    async execute( interaction )
    {
        const input = interaction.options.getString( '입력' );

        await interaction.reply( input );
    }
};