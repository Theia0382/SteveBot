const { SlashCommandBuilder } = require( 'discord.js' );
const Server = require( '../modules/server.js' );
const path = require( 'node:path' );
const { getJSON, updateJSON } = require('../modules/accessJSON.js');
const { ChannelType } = require( 'discord-api-types/v9' );

const notificationConfigPath = path.join( __dirname, '../data/notificationConfig.json' );

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
                    .setRequired( true ) ) ) )
        .addSubcommandGroup( subcommandgroup => subcommandgroup
            .setName( 'notification' )
            .setDescription( '알림 관련 설정' )
            .addSubcommand( subcommand => subcommand
                .setName( 'set_channel' )
                .setDescription( '알림 수신 채널을 등록합니다.' )
                .addChannelOption( option => option
                    .setName( 'channel' )
                    .setDescription( '알림 수신 채널을 선택해주세요.' )
                    .setRequired( true )
                    .addChannelTypes( ChannelType.GuildText ) ) )
            .addSubcommand( subcommand => subcommand
                .setName( 'set_active_notification' )
                .setDescription( '활성화할 알림을 선택합니다.' )
                .addBooleanOption( option => option
                    .setName( 'newplayer' )
                    .setDescription( '새로운 플레이어 알림' ) ) ) ),
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
        if ( interaction.options.getSubcommandGroup( ) == 'notification' )
        {
            const notificationConfig = getJSON( notificationConfigPath );

            if ( interaction.options.getSubcommand( ) == 'set_channel' )
            {
                const channel = interaction.options.getChannel( 'channel' );

                notificationConfig[ interaction.guildId ].channel = channel.id;
                updateJSON( notificationConfigPath, notificationConfig );
                interaction.editReply( `이제 알림을 ${channel.name} 채널에서 수신합니다.` );
            }

            if ( interaction.options.getSubcommand( ) == 'set_active_notification' )
            {
                const newplayer = interaction.options.getBoolean( 'newplayer' );

                if ( newplayer != null )
                {
                    notificationConfig[ guildId ].active.newplayers = newplayer;
                    
                    updateJSON( notificationConfigPath, notificationConfig );

                    interaction.editReply( `이제 새로운 플레이어 알림 활성화 여부는 다음과 같습니다.\n: ${newplayer}` );
                }
            }
        }
	}
};