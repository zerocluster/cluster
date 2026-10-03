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

        if ( version > host.version ) {
            host.version = version;

            for ( const uri in services ) {

                // added
                if ( !host.services.has( uri ) ) {
                    this.#services = null;

                    const service = {
                        uri,
                        "serviceName": services[ uri ].serviceName,
                    };

                    host.services.set( uri, service );

                    updated = true;
                }
            }

            for ( const uri in host.services.keys() ) {

                // deleted
                if ( !services[ uri ] ) {
                    this.#services = null;

                    host.services.delete( uri );

                    updated = true;
                }
            }

            if ( host.services.size ) {
                this.#hosts[ hostname ] = host;
            }
            else {
                delete this.#hosts[ hostname ];
            }
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

            this.#services = {};

            for ( const host of Object.values( this.#hosts ) ) {
                for ( const service of host.services.values() ) {
                    const id = `${ host.appName }/${ service.serviceName }/${ host.hostname }/${ service.uri }`;

                    this.#services[ id ] = {
                        id,
                        "appName": host.appName,
                        "serviceName": service.serviceName,
                        "hostname": host.hostname,
                        "uri": service.uri,
                        "url": `//${ host.hostname }${ service.uri }`,
                    };
                }
            }
        }

        return {
            "version": this.#version,
            "services": this.#services,
        };
    }
}
