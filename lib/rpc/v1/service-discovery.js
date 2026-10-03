import ServiceDiscoveryServer from "#lib/service-discovery-server";

const serviceDiscovery = new ServiceDiscoveryServer();

export default Super =>
    class extends Super {
        #connections = {};

        // public
        async [ "API_set-host-services" ] ( ctx, { version, appName, services } ) {
            const connection = ctx.connection,
                hostname = connection.remoteAddress.toString();

            if ( this.#connections[ hostname ] ) {
                if ( connection !== this.#connections[ hostname ] ) {
                    return result( [ 400, "Connection already exists" ] );
                }
            }
            else {
                this.#connections[ hostname ] = connection;

                connection.once( "disconnect", this.#onDisconnect.bind( this ) );
            }

            const updated = serviceDiscovery.setHostServices( hostname, { version, appName, services } );

            if ( updated ) {
                this.app.publishToRpc( "service-discovery/update", serviceDiscovery.getServices() );
            }

            return result( 200 );
        }

        async [ "API_get-services" ] ( ctx ) {
            return result( 200, serviceDiscovery.getServices() );
        }

        // private
        #onDisconnect ( connection ) {
            const hostname = connection.remoteAddress.toString();

            if ( !this.#connections[ hostname ] ) return;

            delete this.#connections[ hostname ];

            const updated = serviceDiscovery.deleteHost( hostname );

            if ( updated ) {
                this.app.publishToRpc( "service-discovery/update", serviceDiscovery.getServices() );
            }
        }
    };
