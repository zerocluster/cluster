import App from "#core/app";

export default class extends App {
    constructor () {
        super( import.meta.url, {
            "rpcEnabled": true,
        } );
    }
}
