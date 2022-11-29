const { SlashCommandBuilder } = require( '@discordjs/builders' );
const config = require( '../config' );
const isAdmin = require( '../modules/adminChecker' );

module.exports =
{
    data : new SlashCommandBuilder( )
        .setName( '관리자' )
        .setDescription( '관리자 권한 설정' ) 
        .addSubcommand( subcommand => subcommand
            .setName( '사용자' )
            .setDescription( '관리자 권한을 가진 사용자를 확인합니다.' )
            .addUserOption( option => option
                .setName( '사용자_선택' )
                .setDescription( '관리자 권한을 설정할 사용자를 선택합니다.' ) )
            .addStringOption( option => option
                .setName( '설정_유형' )
                .setDescription( '관리자 권한 등록/해제를 선택합니다.' )
                .addChoice( '등록', '등록' )
                .addChoice( '해제', '해제' ) ) )
        .addSubcommand( subcommand => subcommand
            .setName( '역할' )
            .setDescription( '역할의 관리자 권한을 설정합니다.' )
            .addRoleOption( option => option
                .setName( '역할_선택' )
                .setDescription( '관리자 권한을 설정할 역할을 선택합니다.') )
            .addStringOption( option => option
                .setName( '설정_유형' )
                .setDescription( '관리자 권한 등록/해제를 선택합니다.' )
                .addChoice( '등록', '등록' )
                .addChoice( '해제', '해제' ) ) ),
    
    async execute( interaction )
    {
        if ( interaction.options.getSubcommand( ) == '사용자' )
        {
            const user = interaction.options.getUser( '사용자_선택' );
            const adminUser = config.get( 'admin.user' );
            const editType = interaction.options.getString( '설정_유형' );

            if ( user )
            {
                let userIndex = -1;
                for ( i = 0; i < adminUser.length; i++ )
                {
                    if ( adminUser[ i ].id == user.id )
                    {
                        userIndex = i;
                    }
                }

                if ( editType )
                {
                    if ( !isAdmin( interaction ) )
                    {
                        await interaction.reply( { content : '관리자만 사용 가능한 명령입니다.', ephemeral : true } )
                        return;
                    }

                    if ( editType == '등록' )
                    {
                        if ( userIndex == -1 )
                        {
                            adminUser.push( 
                            {
                                'name' : user.username,
                                'id' : user.id
                            } );
                            config.edit( 'admin.user', adminUser );
                            interaction.reply( `사용자 ${user.username}을(를) 관리자로 등록했습니다.` );
                            console.log( `사용자 ${user.username}을(를) 관리자로 등록했습니다.` );
                        }
                        else
                        {
                            interaction.reply( { content : `사용자 ${user.username}은(는) 이미 관리자입니다.`, ephemeral : true } )
                        }
                    }
                    else if ( editType == '해제' )
                    {

                        if ( userIndex != -1 )
                        {
                            adminUser.splice( userIndex, 1 );
                            config.edit( 'admin.user', adminUser );
                            interaction.reply( `사용자 ${user.username}은(는) 더 이상 관리자가 아닙니다.` );
                            console.log( `사용자 ${user.username}은(는) 더 이상 관리자가 아닙니다.` );
                        }
                        else
                        {
                            interaction.reply( { content : `사용자 ${user.username}은(는) 이미 관리자가 아닙니다.`, ephemeral : true } );
                        }
                    }
                }
                else
                {
                    if ( userIndex != -1 )
                    {
                        interaction.reply( `사용자 ${user.username}은(는) 관리자입니다.` );
                    }
                    else
                    {
                        interaction.reply( `사용자 ${user.username}은(는) 관리자가 아닙니다.` );
                    }
                }
            }
            else
            {
                if ( editType )
                {
                    interaction.reply( { content : '사용자를 선택하세요.', ephemeral : true } );
                }

                let adminList = '';
                for ( i = 0; i < adminUser.length; i++ )
                {
                    adminList = adminList + `\n${adminUser[ i ].name}`;
                }
                interaction.reply( `관리자 사용자 목록 : ${adminList}` );
            }
        }
        else if ( interaction.options.getSubcommand( ) == '역할' )
        {
            const role = interaction.options.getRole( '역할_선택' );
            const adminRole = config.get( 'admin.role' );
            const editType = interaction.options.getString( '설정_유형' );

            if ( role )
            {
                let roleIndex = -1;
                for ( i = 0; i < adminRole.length; i++ )
                {
                    if ( adminRole[ i ].id == role.id )
                    {
                        roleIndex = i;
                    }
                }

                if ( editType )
                {
                    if ( !isAdmin( interaction ) )
                    {
                        await interaction.reply( { content : '관리자만 사용 가능한 명령입니다.', ephemeral : true } )
                        return;
                    }

                    if ( editType == '등록' )
                    {
                        if ( roleIndex == -1 )
                        {
                            adminRole.push( 
                            {
                                'name' : role.name,
                                'id' : role.id
                            } );
                            config.edit( 'admin.role', adminRole );
                            interaction.reply( `역할 ${role.name}을(를) 관리자로 등록했습니다.` );
                            console.log( `역할 ${role.name}을(를) 관리자로 등록했습니다.` );
                        }
                        else
                        {
                            interaction.reply( { content : `역할 ${role.name}은(는) 이미 관리자입니다.`, ephemeral : true } )
                        }
                    }
                    else if ( editType == '해제' )
                    {

                        if ( roleIndex != -1 )
                        {
                            adminRole.splice( roleIndex, 1 );
                            config.edit( 'admin.role', adminRole );
                            interaction.reply( `역할 ${role.name}은(는) 더 이상 관리자가 아닙니다.` );
                            console.log( `역할 ${role.name}은(는) 더 이상 관리자가 아닙니다.` );
                        }
                        else
                        {
                            interaction.reply( { content : `역할 ${role.name}은(는) 이미 관리자가 아닙니다.`, ephemeral : true } );
                        }
                    }
                }
                else
                {
                    if ( roleIndex != -1 )
                    {
                        interaction.reply( `역할 ${role.name}은(는) 관리자입니다.` );
                    }
                    else
                    {
                        interaction.reply( `역할 ${role.name}은(는) 관리자가 아닙니다.` );
                    }
                }
            }
            else
            {
                if ( editType )
                {
                    interaction.reply( { content : '역할을 선택하세요.', ephemeral : true } );
                }

                let adminList = '';
                for ( i = 0; i < adminRole.length; i++ )
                {
                    adminList = adminList + `\n${adminRole[ i ].name}`;
                }
                interaction.reply( `관리자 역할 목록 : ${adminList}` );
            }
        }
    }
}