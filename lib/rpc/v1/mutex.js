import Base from "#app/prototypes/base";
import Mutex from "#core/threads/mutex";
import * as uuid from "#core/uuid";

export default class extends Base {
    #mutexSet = new Mutex.Set();

    constructor ( api ) {
        super( api );

        api.app.on( "client/disconnect", options => {
            console.log( "--- client disconnected", options );
        } );
    }

    // XXX
    async API_is_locked ( ctx, id ) {}

    // XXX
    async API_try_down ( ctx, id ) {
        if ( id && !this.#mutexSet.has( id ) ) return result( [500, `Mutex is not exists`] );

        id ||= uuid.v4();

        const mutex = this.#mutexSet.get( id );

        if ( mutex.tryDown() ) {

            // XXX watch for client disconnected, automatically up mutex

            return result( 200, id );
        }
        else {
            return result( 500, id );
        }
    }

    // XXX
    async API_down ( ctx, id ) {
        console.log( ctx.connectionId );

        if ( id && !this.#mutexSet.has( id ) ) return result( [500, `Mutex is not exists`] );

        id ||= uuid.v4();

        const mutex = this.#mutexSet.get( id );

        await mutex.down();

        // client was disconnected
        if ( !this.app.isClientConnected( ctx.clientId ) ) {
            mutex.up();

            return result( 500 );
        }

        // client is connected
        else {
            return result( 200, id );
        }
    }

    async API_up ( ctx, id ) {
        if ( id && !this.#mutexSet.has( id ) ) return result( [500, `Mutex is not exists`] );

        id ||= uuid.v4();

        const mutex = this.#mutexSet.get( id );

        mutex.up();

        return result( 200, id );
    }
}
