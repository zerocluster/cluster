export default Super =>
    class extends Super {
        #connections = new Map();

        // public
        async [ "API_register-service" ] ( ctx, { appName, serviceName, port } ) {
            const connection = ctx.connection;

            let connectionData = this.#connections.get( connection );

            if ( connectionData ) {
                appName = connectionData.appName;
            }

            // register new connection
            else {
                connectionData = {
                    appName,
                    "ports": {},
                };

                this.#connections.set( connection, connectionData );

                connection.once( "disconnect", this.#onDisconnect.bind( this ) );
            }

            const host = `${ connection.remoteAddress }:${ port }`;

            if ( !connectionData.ports[ port ] ) {
                connectionData.ports[ port ] = {
                    serviceName,
                    host,
                };

                // publish update
                this.app.publishToRpc( `service-discovery/add-service/${ appName }/${ serviceName }`, {
                    appName,
                    serviceName,
                    host,
                } );
            }

            return result( 200 );
        }

        async [ "API_unregister-service" ] ( ctx, { port } ) {
            const connection = ctx.connection;

            this.#removeService( connection, port );

            return result( 200 );
        }

        async [ "API_get-service-hosts" ] ( ctx, { appName, serviceName } = {} ) {
            const hosts = [];

            for ( const connectionData of this.#connections.values() ) {
                if ( appName && connectionData.appName !== appName ) continue;

                for ( const port in connectionData.ports ) {
                    const portData = connectionData.ports[ port ];

                    if ( serviceName && portData.serviceName !== serviceName ) continue;

                    hosts.push( {
                        "appName": connectionData.appName,
                        "serviceName": portData.serviceName,
                        "host": portData.host,
                    } );
                }
            }

            return result( 200, hosts );
        }

        // private
        #onDisconnect ( connection ) {
            const connectionData = this.#connections.get( connection );

            if ( !connectionData ) return;

            this.#connections.delete( connection );

            for ( const port in connectionData.ports ) {
                const portData = connectionData.ports[ port ];

                // publish update
                this.app.publishToRpc( `service-discovery/delete-service/${ connectionData.appName }/${ portData.serviceName }`, {
                    "appName": connectionData.appName,
                    "serviceName": portData.serviceName,
                    "host": portData.host,
                } );
            }
        }

        #removeService ( connection, port ) {
            const connectionData = this.#connections.get( connection );

            // connection is not registered
            if ( !connectionData ) return;

            const portData = connectionData.ports[ port ];

            // port is not registered
            if ( !portData ) return;

            delete connectionData.ports[ port ];

            // publish update
            this.app.publishToRpc( `service-discovery/delete-service/${ connectionData.appName }/${ portData.serviceName }`, {
                "appName": connectionData.appName,
                "serviceName": portData.serviceName,
                "host": portData.host,
            } );
        }
    };
