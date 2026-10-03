import path from "node:path";

export default class ServiceDiscoveryApi {
    #hosts = {};
    #version = 0;
    #services;

    // public
    setHostServices ( hostname, { version, appName, services } ) {
        let updated = false,
            host = this.#hosts[ hostname ];

        if ( !host ) {
            host = {
                "version": -1,
                hostname,
                appName,
                "services": new Map(),
            };
        }

        if ( version <= host.version ) return updated;

        host.version = version;

        services = Object.fromEntries( services.map( service => [ path.join( service.port.toString(), service.pathname ), service ] ) );

        for ( const id in services ) {

            // added
            if ( !host.services.has( id ) ) {
                this.#services = null;

                const service = {
                    id,
                    ...services[ id ],
                };

                host.services.set( id, service );

                updated = true;
            }
        }

        for ( const id of host.services.keys() ) {

            // deleted
            if ( !services[ id ] ) {
                this.#services = null;

                host.services.delete( id );

                updated = true;
            }
        }

        if ( host.services.size ) {
            this.#hosts[ hostname ] = host;
        }
        else {
            delete this.#hosts[ hostname ];
        }

        return updated;
    }

    deleteHost ( hostname ) {
        const host = this.#hosts[ hostname ];

        let updated = false;

        if ( host ) {
            this.#services = null;

            delete this.#hosts[ hostname ];

            updated = true;
        }

        return updated;
    }

    getServices () {
        if ( !this.#services ) {
            this.#version++;

            this.#services = [];

            for ( const host of Object.values( this.#hosts ) ) {
                for ( const service of host.services.values() ) {
                    this.#services.push( {
                        "appName": host.appName,
                        "serviceName": service.serviceName,
                        "url": `//${ host.hostname }:${ service.port }${ service.pathname }`,
                    } );
                }
            }
        }

        return {
            "version": this.#version,
            "services": this.#services,
        };
    }
}
