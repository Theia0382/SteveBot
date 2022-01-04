module.exports =
{
    name : 'interactionCreate',

    async execute( interaction )
    {
        console.log( `\n상호작용 발생!\n서버 : ${interaction.guild.name}\n채널 : ${interaction.channel.name}\n사용자 : ${interaction.user.tag}\n` );

    	if ( !interaction.isCommand( ) )
        {
            return;
        }

    	const command = interaction.client.commands.get( interaction.commandName );

        if ( !command )
        {
            return;
        }

        try
        {
            console.log( `/${command.data.name} 실행` );
            await command.execute( interaction );
        }
        catch ( error )
        {
            console.error( error );
            await interaction.reply( { content : '명령을 실행하던 중 에러가 발생했습니다!', ephemeral : true } );
        }
    }
}