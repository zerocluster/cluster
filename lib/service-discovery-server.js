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

    getServices ( { appName, serviceName } = {} ) {
        if ( !this.#services ) {
            this.#version++;

            this.#services = {};

            for ( const host of Object.values( this.#hosts ) ) {
                for ( const [ serviceName, service ] of host.services.entries() ) {
                    const id = `${ host.appName }/${ serviceName }`;

                    this.#services[ id ] ??= [];
                    this.#services[ id ].push( {
                        "appName": host.appName,
                        serviceName,
                        "uri": `//${ host.hostname }:${ service.port }${ service.pathname }`,
                        "hostname": service.hostname,
                    } );
                }
            }
        }

        if ( appName || serviceName ) {
            const services = {};

            for ( const id in this.#services ) {
                const service = this.#services[ id ];

                if ( appName && service.appName !== appName ) continue;
                if ( serviceName && service.serviceName !== serviceName ) continue;

                services[ id ] ??= [];
                services[ id ].push( service );
            }

            return {
                "version": this.#version,
                services,
            };
        }
        else {
            return {
                "version": this.#version,
                "services": this.#services,
            };
        }
    }
}
