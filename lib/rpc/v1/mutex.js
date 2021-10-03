import Base from "#app/prototypes/base";
import Mutex from "#core/threads/mutex";
import * as uuid from "#core/uuid";

export default class extends Base {
    #mutexSet = new Mutex.Set();

    async API_try_down ( ctx, id ) {
        if ( id && !this.#mutexSet.has( id ) ) return result( [500, `Mutex not exists`] );

        id ||= uuid.v4();

        const mutex = this.#mutexSet.get( id );

        if ( mutex.tryDown() ) {
            return result( 200, id );
        }
        else {
            return result( 500, id );
        }
    }

    async API_down ( ctx, id ) {
        if ( id && !this.#mutexSet.has( id ) ) return result( [500, `Mutex not exists`] );

        id ||= uuid.v4();

        const mutex = this.#mutexSet.get( id );

        await mutex.down();

        return result( 200, id );
    }

    async API_up ( ctx, id ) {
        if ( id && !this.#mutexSet.has( id ) ) return result( [500, `Mutex not exists`] );

        id ||= uuid.v4();

        const mutex = this.#mutexSet.get( id );

        mutex.up();

        return result( 200, id );
    }
}
