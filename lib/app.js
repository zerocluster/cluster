import App from "#core/app";

export default class extends App {
    constructor () {
        super( import.meta.url, {
            "apiEnabled": false,
            "rpcEnabled": true,
        } );
    }
}
