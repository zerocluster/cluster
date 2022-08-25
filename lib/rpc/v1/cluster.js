import Base from "#core/app/prototypes/base";

export default class extends Base {

    // api
    API_publish ( ctx, name, msg ) {
        this.api.forwardEvent( name, [msg], {}, ctx.data.connection.id );

        return result( 200 );
    }
}
