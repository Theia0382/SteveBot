const { SlashCommandBuilder } = require( '@discordjs/builders' );
const config = require( '../config' );
const isAdmin = require( '../modules/adminChecker' );
const { ChannelType } = require( 'discord-api-types/v9' );

module.exports =
{
    data : new SlashCommandBuilder( )
        .setName( '알림' )
        .setDescription( '알림 설정' )
        .addSubcommand( subcommand => subcommand
            .setName( '사용_설정' )
            .setDescription( '알림 사용 설정을 확인합니다' )
            .addStringOption( option => option
                .setName( '사용_여부' )
                .setDescription( '사용 여부를 선택합니다.' )
                .addChoice( '사용함', '사용함' )
                .addChoice( '사용 안 함', '사용 안 함' ) ) )
        .addSubcommand( subcommand => subcommand
            .setName( '채널_설정' )
            .setDescription( '알림을 수신하는 채널을 확인합니다' )
            .addChannelOption( option => option
                .setName( '채널_선택' )
                .setDescription( '알림을 수신할 채널을 선택합니다.' )
                .addChannelType( ChannelType.GuildText ) ) ),
    
    async execute( interaction )
    {
        
        if ( interaction.options.getSubcommand( ) == '사용_설정' )
        {
            const use = interaction.options.getString( '사용_여부' );
            const using = config.get( 'notification.on' );

            if ( use )
            {
                if ( !isAdmin( interaction ) )
                {
                    await interaction.reply( { content : '관리자만 사용 가능한 명령입니다.', ephemeral : true } )
                    return;
                }
                
                if ( use == '사용함' )
                {
                    if ( !using )
                    {
                        config.edit( 'notification.on', true );
                        interaction.reply( '이제 알림을 사용합니다.' );
                        console.log( '이제 알림을 사용합니다.' );
                    }
                    else
                    {
                        interaction.reply( { content : '이미 알림을 사용하는 중입니다.', ephemeral : true } );
                    }
                }
                else if ( use == '사용 안 함' )
                {
                    if ( using )
                    {
                        config.edit( 'notification.on', false );
                        interaction.reply( '이제 알림을 사용하지 않습니다.' );
                        console.log( '이제 알림을 사용하지 않습니다.' );
                    }
                    else
                    {
                        interaction.reply( { content : '이미 알림을 사용하는 중이 아닙니다.', ephemeral : true } );
                    }
                }
            }
            else
            {
                if ( using )
                {
                    interaction.reply( '알림을 사용하는 중입니다' );
                }
                else
                {
                    interaction.reply( '알림을 사용하는 중이 아닙니다');
                }
            }
        }
        else if ( interaction.options.getSubcommand( ) == '채널_설정' )
        {
            const channel = interaction.options.getChannel( '채널_선택' );
            
            if ( channel )
            {
                if ( !isAdmin( interaction ) )
                {
                    await interaction.reply( { content : '관리자만 사용 가능한 명령입니다.', ephemeral : true } )
                    return;
                }

                if ( config.get( 'notification.channel.id' ) != channel.id )
                {
                    config.edit( 'notification.channel.name', channel.name );
                    config.edit( 'notification.channel.id', channel.id );
                    interaction.reply( `이제 알림을 ${channel.name} 채널에서 수신합니다.` );
                    console.log( `이제 알림을 ${channel.name} 채널에서 수신합니다.` );
                }
                else
                {
                    interaction.reply( `이미 알림을 ${channel.name} 채널에서 수신하는 중입니다.`)
                }
            }
            else
            {
                interaction.reply( `알림을 ${config.get( 'notification.channel.name' )} 채널에서 수신하는 중입니다`)
            }
        }
    }
}