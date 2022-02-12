import App from "#core/app";
import config from "#lib/app.config";

export default class extends App {
    constructor () {
        super( import.meta.url, config );
    }
}
