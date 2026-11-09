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

        for ( const serviceName in services ) {

            // added
            if ( !host.services.has( serviceName ) ) {
                this.#services = null;

                host.services.set( serviceName, services[ serviceName ] );

                updated = true;
            }
        }

        for ( const serviceName of host.services.keys() ) {

            // deleted
            if ( !services[ serviceName ] ) {
                this.#services = null;

                host.services.delete( serviceName );

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

            this.#services = {};

            for ( const host of Object.values( this.#hosts ) ) {
                for ( const [ serviceName, service ] of host.services.entries() ) {
                    this.#services[ `${ host.appName }/${ serviceName }` ] = {
                        "appName": host.appName,
                        serviceName,
                        "uri": `//${ host.hostname }:${ service.port }${ service.pathname }`,
                        "hostname": service.hostname,
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
