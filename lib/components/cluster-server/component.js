import ClusterServer from "./cluster-server.js";

export default Super =>
    class extends Super {

        // protected
        async _install () {
            return new ClusterServer( this.app, this.config );
        }
    };
