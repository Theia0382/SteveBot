const config = require( '../config' );

const registerUser = function( userID )
{
    const adminID = config.get( 'admin.user' );
    userIndex = adminID.indexOf( userID );
    if ( userIndex == -1 )
    {
        adminID.push( userID );
        config.edit( 'admin.user', adminID );
    }
}

const registerRole = function( roleID )
{
    const adminID = config.get( 'admin.role' );
    roleIndex = adminID.indexOf( roleID );
    if ( roleIndex == -1 )
    {
        adminID.push( roleID );
        config.edit( 'admin.role', adminID );
    }
}

const retractUser = function( userID )
{
    const adminID = config.get( 'admin.user' );
    userIndex = adminID.indexOf( userID );
    if ( userIndex != -1 )
    {
        adminID.splice( userIndex, 1 );
        config.edit( 'admin.user', adminID );
    }
}

const retractRole = function( roleID )
{
    const adminID = config.get( 'admin.role' );
    roleIndex = adminID.indexOf( roleID );
    if ( roleIndex != -1 )
    {
        adminID.splice( roleIndex, 1 );
        config.edit( 'admin.role', adminID );
    }
}

const isAdmin = function( interaction )
{
    const adminUserID = config.get( 'admin.user' );
    const adminRoleID = config.get( 'admin.role' );

    if ( adminUserID.length == 0 && adminRoleID.length == 0 )
    {
        return true;
    }

    const userID = interaction.user.id;
    const roleID = Array.from( interaction.member.roles.cache.keys( ) );

    if ( adminUserID.indexOf( userID ) != -1 )
    {
        return true;
    }

    for ( i = 0; i < roleID.length; i++ )
    {
        if ( adminRoleID.indexOf( roleID[ i ] ) != -1 )
        {
            return true;
        }
    }

    return false;
}

module.exports =
{
    registerUser,
    registerRole,
    retractUser,
    retractRole,
    isAdmin
}