export default Super =>
    class extends Super {
        #connections = new Map();

        // public
        async [ "API_register-service" ] ( ctx, { appName, serviceName, port } ) {
            const connection = ctx.connection;

            let connectionData = this.#connections.get( connection.remoteAddress.toString() );

            if ( connectionData ) {
                if ( connection !== connectionData.connection ) {
                    return result( [ 400, "Connection already exists" ] );
                }

                if ( appName !== connectionData.appName ) {
                    return result( [ 400, "Invalid app name for connection" ] );
                }
            }

            // register new connection
            else {
                connectionData = {
                    connection,
                    appName,
                    "ports": {},
                };

                this.#connections.set( connection.remoteAddress.toString(), connectionData );

                connection.once( "disconnect", this.#onDisconnect.bind( this ) );
            }

            const host = `${ connection.remoteAddress }:${ port }`;

            if ( !connectionData.ports[ port ] ) {
                const portData = {
                    serviceName,
                    host,
                };

                connectionData.ports[ port ] = portData;

                // publish update
                this.app.publishToRpc( "service-discovery/update", {
                    "add": {
                        appName,
                        ...portData,
                    },
                } );

                this.app.publishToRpc( `service-discovery/add-service/${ appName }/${ serviceName }`, {
                    appName,
                    ...portData,
                } );
            }

            return result( 200 );
        }

        async [ "API_unregister-service" ] ( ctx, { port } ) {
            const connection = ctx.connection;

            const connectionData = this.#connections.get( connection.remoteAddress.toString() );

            if ( !connectionData ) return result( [ 400, "Invalid connection" ] );

            if ( connection !== connectionData.connection ) {
                return result( [ 400, "Connection already exists" ] );
            }

            const portData = connectionData.ports[ port ];

            // port is not registered
            if ( !portData ) return result( [ 400, "Port not registered" ] );

            delete connectionData.ports[ port ];

            // publish update
            this.app.publishToRpc( "service-discovery/update", {
                "delete": {
                    "appName": connectionData.appName,
                    ...portData,
                },
            } );

            this.app.publishToRpc( `service-discovery/delete-service/${ connectionData.appName }/${ portData.serviceName }`, {
                "appName": connectionData.appName,
                ...portData,
            } );

            return result( 200 );
        }

        async [ "API_get-hosts" ] ( ctx, { appName, serviceName } = {} ) {
            const hosts = [];

            for ( const connectionData of this.#connections.values() ) {
                if ( appName && connectionData.appName !== appName ) continue;

                for ( const port in connectionData.ports ) {
                    const portData = connectionData.ports[ port ];

                    if ( serviceName && portData.serviceName !== serviceName ) continue;

                    hosts.push( {
                        "appName": connectionData.appName,
                        ...portData,
                    } );
                }
            }

            return result( 200, hosts );
        }

        // private
        #onDisconnect ( connection ) {
            const connectionData = this.#connections.get( connection.remoteAddress.toString() );

            if ( !connectionData ) return;

            this.#connections.delete( connection );

            for ( const port in connectionData.ports ) {
                const portData = connectionData.ports[ port ];

                // publish update
                this.app.publishToRpc( "service-discovery/update", {
                    "delete": {
                        "appName": connectionData.appName,
                        ...portData,
                    },
                } );

                this.app.publishToRpc( `service-discovery/delete-service/${ connectionData.appName }/${ portData.serviceName }`, {
                    "appName": connectionData.appName,
                    ...portData,
                } );
            }
        }
    };
