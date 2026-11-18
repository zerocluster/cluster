import ServiceDiscovery from "./cluster-server/service-discovery.js";

export default class ClusterServer {
    #app;
    #config;
    #serviceDiscovery;

    constructor ( app, config ) {
        this.#app = app;
        this.#config = config;
        this.#serviceDiscovery = new ServiceDiscovery();
    }

    // properties
    get app () {
        return this.#app;
    }

    get config () {
        return this.#config;
    }

    get serviceDiscovery () {
        return this.#serviceDiscovery;
    }
}
