const net = require( 'net' );
const { getJSON, updateJSON } = require( './accessJSON.js' );
const path = require( 'node:path' );

const serverAddressPath = path.join( __dirname, '../data/serverAddress.json' );

const serverAddress = getJSON( serverAddressPath );

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

class Server
{
    constructor( guildId )
    {
        this.id = guildId;
    }

    register( address )
    {
        serverAddress[ this.id ] = address;
        console.log( serverAddress );
        updateJSON( serverAddressPath, serverAddress );
    }

    getAddress( )
    {
        return serverAddress[ this.id ];
    }

    getInfo( callback )
    {
        if ( serverAddress[ this.id ] === undefined )
        {
            const error = new Error( );
            error.message = `There is no registered address at GuildID: ${ this.id }`
            error.code = 'NOADDRESS';
            callback( error );
        }

        const host = serverAddress[ this.id ].split( ':' )[ 0 ];
        let port = serverAddress[ this.id ].split( ':' )[ 1 ];
        if ( port === undefined )
        {
            // 마인크래프트 서버 기본 포트: 25565
            port = '25565';
        }

        let info = '';

        const socket = new net.Socket;

        socket.setTimeout( 2000 );

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
                info += data;
            } );
        } );

        socket.on( 'error', ( error ) =>
        {
            callback( error );
        } );

        socket.on( 'timeout', ( ) =>
        {
            socket.destroy( );
            info = info.slice( info.indexOf( '{' ) );

            if( info.length == 0 || !JSON.parse( info ) )
            {
                const error = new Error( );
                error.message = 'Received Empty JSON';
                error.code = 'NODATA'
                callback( error );
            }
            else if ( Object.keys( JSON.parse( info ) ).length == 0 )
            {
                const error = new Error( );
                error.message = 'Received Empty JSON';
                error.code = 'NODATA'
                callback( error );
            }
            else
            {
                info = JSON.parse( info );

                if ( info.players.online != 0 )
                {
                    let comp = [];
                	info.players.sample.forEach( player =>
                	{
                		if ( !comp.includes( player ) )
                        {
                            comp.push( player );
                        }
                	} );
                
                    for ( let i = 0; i < comp.length ; i++ ) 
                    {
                        if ( comp[ i ].name == 'Anonymous Player' )
                        {
                            comp.splice( i, 1 );
                            i--;
                        }
                    }
                
                    info.players.online = comp.length;
                
                    if ( comp.length == 0 )
                    {
                        delete info.players.sample;
                    }
                    else
                    {
                        info.players.sample = comp;
                    }
                }

                callback( null, info );
            }
        } );

        socket.connect( port, host );
    }
}

module.exports = Server;