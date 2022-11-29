const config = require( '../config' );

const isAdminUser = function( userID )
{
    const adminUser = config.get( 'admin.user' );

    for ( i = 0; i < adminUser.length; i++ )
    {
        if ( adminUser[ i ].id == userID )
        {
            return true;
        }
    }

    return false;
}

const isAdminRole = function( roleID )
{
    const adminRole = config.get( 'admin.role' );

    for ( i = 0; i < roleID.length; i++ )
    {
        for ( j = 0; j < adminRole.length; j++ )
        {
            if ( adminRole[ j ].id == roleID[ i ] )
            {
                return true;
            }
        }
    }

    return false;
}

const isAdmin = function( interaction )
{
    const adminUser = config.get( 'admin.user' );
    const adminRole = config.get( 'admin.role' );

    if ( adminUser.length == 0 && adminRole.length == 0 )
    {
        return true;
    }

    const userID = interaction.user.id;
    const roleID = Array.from( interaction.member.roles.cache.keys( ) );

    if ( isAdminUser( userID ) )
    {
        return true;
    }

    if ( isAdminRole( roleID ) )
    {
        return true;
    }

    return false;
}

module.exports = isAdmin;