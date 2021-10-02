import Base from "#app/prototypes/base";
import Mutex from "#core/threads/mutex";

export default class extends Base {
    #mutexSet = new Mutex.Set();

    async API_try_down ( ctx, id ) {
        const mutex = this.#mutexSet.get( id );

        if ( mutex.tryDown() ) {
            return result( 200 );
        }
        else {
            return result( 500 );
        }
    }

    async API_down ( ctx, id ) {
        const mutex = this.#mutexSet.get( id );

        await mutex.down();

        return result( 200 );
    }

    async API_up ( ctx, id ) {
        const mutex = this.#mutexSet.get( id );

        mutex.up();

        return result( 200 );
    }
}
