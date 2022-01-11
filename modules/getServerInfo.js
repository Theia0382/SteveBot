const net = require( 'net' );
const config = require( '../config' );

function writeVarInt( buffer, value )
{
    while ( true )
    {
        if ( ( value & ~0x7F ) == 0 )
        {
            buffer = Buffer.concat( [ buffer, Buffer.from( [ value ] ) ] );
            return buffer;
        }

        buffer = Buffer.concat( [ buffer, Buffer.from( [ ( value & 0x7F ) | 0x80 ] ) ] );
        // Note: >>> means that the sign bit is shifted with the rest of the number rather than being left alone
        value >>>= 7;
    }
}

function writeString( buffer, value )
{
    const data = Buffer.from( value );
    const dataLength = writeVarInt( Buffer.alloc( 0 ), data.length );
    buffer = Buffer.concat( [ buffer, dataLength, data ] );
    return buffer;
}

function writeShort( buffer, value )
{
    const data = Buffer.alloc( 2 );
    data.writeUInt16BE( value );

    buffer = Buffer.concat( [ buffer, data ] );
    return buffer;
}

function flush( socket, buffer )
{
    buffer = Buffer.concat( [ writeVarInt( Buffer.alloc( 0 ), buffer.length ), buffer ] );
    socket.write( buffer );
}

function getServerInfo( callback )
{
    const serverAddress = config.get( 'serverAddress' );
    const host = serverAddress.split( ':' )[ 0 ];
    const port = serverAddress.split( ':' )[ 1 ];

    const socket = new net.Socket;

    socket.setTimeout( 2000 );
    let error;

    socket.connect( port, host );

    socket.on( 'connect', ( ) =>
    {
        let packet;

        // Handshake
        {
            packet = Buffer.alloc( 0 );
            packet = writeVarInt( packet, 0x00 );
            packet = writeVarInt( packet, 47 );
            packet = writeString( packet, host );
            packet = writeShort( packet, port );
            packet = writeVarInt( packet, 1 );
            flush( socket, packet );
        }

        // Request
        {
            packet = Buffer.alloc( 0 );
            packet = writeVarInt( packet, 0x00 );
            flush( socket, packet );
        }

        socket.setEncoding( 'utf-8' );

        socket.on( 'data', ( data ) =>
        {
            socket.destroy( );
            data = data.slice( data.indexOf( '{' ) );
            try
            {
                if( Object.keys( JSON.parse( data ) ).length == 0 )
                {
                    error = 'Received Empty JSON';
                    callback( error );
                }
                else
                {
                    callback( error, data );
                }
            }
            catch ( error )
            {
                callback( error );
            }
        } );
    } );

    socket.on( 'error', ( error ) =>
    {
        callback( error );
    } );
}

module.exports = getServerInfo;