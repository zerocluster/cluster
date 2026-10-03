export default class ServiceDiscoveryApi {
    #hosts = {};
    #version = 0;
    #services;

    // public
    setHostServices ( hostname, { version, appName, services } ) {
        const added = [],
            deleted = {};

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

        if ( version > host.version ) {
            host.version = version;

            for ( const url in services ) {

                // added
                if ( !host.services.has( url ) ) {
                    this.#services = null;

                    const service = {
                        url,
                        "serviceName": services[ url ].serviceName,
                    };

                    host.services.add( url, service );

                    updated = true;
                    added.push( {
                        "appName": host.appName,
                        "serviceName": service.serviceName,
                        url,
                        hostname,
                    } );
                }
            }

            for ( const url in host.services.keys() ) {

                // deleted
                if ( !services[ url ] ) {
                    this.#services = null;

                    const service = host.services.delete( url );

                    updated = true;
                    deleted.push( {
                        "appName": host.appName,
                        "serviceName": service.serviceName,
                        url,
                        hostname,
                    } );
                }
            }

            if ( host.services.size ) {
                this.#hosts[ hostname ] = host;
            }
            else {
                delete this.#hosts[ hostname ];
            }
        }

        return {
            updated,
            added,
            deleted,
        };
    }

    deleteHost ( hostname ) {
        const deleted = [],
            host = this.#hosts[ hostname ];

        if ( host ) {
            this.#services = null;

            for ( const [ url, service ] of host.services.entries() ) {
                deleted.push( {
                    "appName": host.appName,
                    "serviceName": service.serviceName,
                    url,
                    hostname,
                } );
            }

            delete this.#hosts[ hostname ];
        }

        return { deleted };
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
                        "url": service.url,
                        "ipAddress": host.ipAddress,
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
