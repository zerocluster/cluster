import Base from "#core/app/prototypes/base";

export default class extends Base {

    // api
    API_publish ( ctx, name, body ) {
        const msg = {
            "jsonrpc": "2.0",
            "method": "/publish",
            "params": [name, body],
        };

        this.app.hub.publish( "rpc/out", name, [msg, {}, ctx.client.id] );

        return result( 200 );
    }
}
