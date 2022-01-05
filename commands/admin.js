const { SlashCommandBuilder } = require( '@discordjs/builders' );
const config = require( '../config' );
const admin = require( '../modules/adminManager' );

module.exports =
{
    data : new SlashCommandBuilder( )
        .setName( '관리자' )
        .setDescription( '관리자 명령' )
        .addSubcommandGroup( subcommandGroup => subcommandGroup
            .setName( '권한_편집' )
            .setDescription( '관리자 권한을 부여하거나 가져갑니다.' ) 
            .addSubcommand( subcommand => subcommand
                .setName( '사용자' )
                .setDescription( '사용자의 관리자 권한을 편집합니다.' )
                .addUserOption( option => option
                    .setName( '사용자_선택' )
                    .setDescription( '관리자 권한을 편집할 사용자를 선택합니다.')
                    .setRequired( true ) )
                .addStringOption( option => option
                    .setName( '편집_유형' )
                    .setDescription( '관리자 권한 등록/해제를 선택합니다.' ) 
                    .setRequired( true )
                    .addChoice( '등록', '등록' )
                    .addChoice( '해제', '해제' ) ) )
            .addSubcommand( subcommand => subcommand
                .setName( '역할' )
                .setDescription( '역할의 관리자 권한을 편집합니다.' )
                .addRoleOption( option => option
                    .setName( '역할_선택' )
                    .setDescription( '관리자 권한을 편집할 역할을 선택합니다.')
                    .setRequired( true ) )
                .addStringOption( option => option
                    .setName( '편집_유형' )
                    .setDescription( '관리자 권한 등록/해제를 선택합니다.' )
                    .setRequired( true )
                    .addChoice( '등록', '등록' )
                    .addChoice( '해제', '해제' ) ) ) ),
    
    async execute( interaction )
    {
        if ( !admin.isAdmin( interaction ) )
        {
            await interaction.reply( '관리자만 사용 가능한 명령입니다.' )
            return;
        }
        
        if ( interaction.options.getSubcommandGroup( ) == '권한_편집' )
        {
            if ( interaction.options.getSubcommand( ) == '사용자' )
            {
                const userID = interaction.options.getUser( '사용자_선택' ).id;
                const userTag = interaction.options.getUser( '사용자_선택' ).tag;
                const editType = interaction.options.getString( '편집_유형' );

                const adminID = config.get( 'admin.user' );
                userIndex = adminID.indexOf( userID );
                
                if ( editType == '등록' )
                {
                    if ( userIndex == -1 )
                    {
                        adminID.push( userID );
                        config.edit( 'admin.user', adminID );
                        interaction.reply( `${userTag}을 관리자로 등록했습니다.` );
                        console.log( `${userTag}을 관리자로 등록했습니다.` );
                    }
                    else
                    {
                        interaction.reply( `${userTag}은 이미 관리자입니다.`)
                    }
                } 
                else if ( editType == '해제' )
                {
                    
                    if ( userIndex != -1 )
                    {
                        adminID.splice( userIndex, 1 );
                        config.edit( 'admin.user', adminID );
                        interaction.reply( `${userTag}은 더 이상 관리자가 아닙니다.` );
                        console.log( `${userTag}은 더 이상 관리자가 아닙니다.` );
                    }
                    else
                    {
                        interaction.reply( `${userTag}은 이미 관리자가 아닙니다.` );
                    }
                }
            }
            else if ( interaction.options.getSubcommand( ) == '역할' )
            {
                const roleID = interaction.options.getRole( '역할_선택' ).id;
                const roleName = interaction.options.getRole( '역할_선택' ).name;
                const editType = interaction.options.getString( '편집_유형' );

                const adminID = config.get( 'admin.role' );
                roleIndex = adminID.indexOf( roleID );
                
                if ( editType == '등록' )
                {
                    if ( roleIndex == -1 )
                    {
                        adminID.push( roleID );
                        config.edit( 'admin.role', adminID );
                        interaction.reply( `${roleName}을 관리자로 등록했습니다.` );
                        console.log( `${roleName}을 관리자로 등록했습니다.` );
                    }
                    else
                    {
                        interaction.reply( `${roleName}은 이미 관리자입니다.`)
                    }
                }
                else if ( editType == '해제' )
                {
                    if ( roleIndex != -1 )
                    {
                        adminID.splice( roleIndex, 1 );
                        config.edit( 'admin.role', adminID );
                        interaction.reply( `${roleName}은 더 이상 관리자가 아닙니다.` );
                        console.log( `${roleName}은 더 이상 관리자가 아닙니다.` );
                    }
                    else
                    {
                        interaction.reply( `${roleName}은 이미 관리자가 아닙니다.`)
                    }
                }
            }
        }
    }
}