import Base from "#app/prototypes/base";
import * as uuid from "#core/uuid";

export default class extends Base {
    #id = uuid.v4();

    // api
    API_subscribe ( ctx, events ) {
        for ( const event of events ) ctx.client.subscribe( this.#id + "/" + event );

        return result( 200 );
    }

    API_unsubscribe ( ctx, events ) {
        for ( const event of events ) ctx.client.unsubscribe( this.#id + "/" + event );

        return result( 200 );
    }

    API_publish ( ctx, event, body ) {
        this.api.forwardEvent( ctx.client.id, this.#id + "/" + event, event, body );

        return result( 200 );
    }
}
