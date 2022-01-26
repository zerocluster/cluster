import Base from "#core/app/prototypes/base";

export default class extends Base {

    // api
    API_publish ( ctx, name, msg ) {
        this.app.forwardEvent( "rpc", ctx.connection.id, name, msg );

        return result( 200 );
    }
}
