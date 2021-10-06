import Base from "#app/prototypes/base";
import Mutex from "#core/threads/mutex";
import * as uuid from "#core/uuid";

export default class extends Base {
    #mutexSet = new Mutex.Set();
    #clientMutex = {};

    constructor ( api ) {
        super( api );

        this.app.on( "client/disconnect", options => {
            const clientId = options.clientId;

            // client has no mutexes
            if ( !this.#clientMutex[clientId] ) return;

            for ( const mutexId of this.#clientMutex[clientId] ) {
                const mutex = this.#mutexSet.get( mutexId );

                mutex.up();
                this.#onMutexUp( mutex, clientId );
            }

            delete this.#clientMutex[clientId];
        } );
    }

    async API_isLocked ( ctx, mutexId ) {
        return result( 200, this.#mutexSet.has( mutexId ) && this.#mutexSet.get( mutexId ).isLocked );
    }

    async API_tryDown ( ctx, mutexId ) {
        mutexId ||= uuid.v4();

        const mutex = this.#mutexSet.get( mutexId );

        // mutex was down
        if ( mutex.tryDown() ) {
            this.#onMutexDown( mutex, ctx.clientId );

            return result( 200, mutexId );
        }

        // mutex wasn't down
        else {
            return result( 500, mutexId );
        }
    }

    async API_down ( ctx, mutexId ) {
        mutexId ||= uuid.v4();

        const mutex = this.#mutexSet.get( mutexId );

        await mutex.down();
        this.#onMutexDown( mutex, ctx.clientId );

        // client was disconnected
        if ( !this.app.isClientConnected( ctx.clientId ) ) {
            mutex.up();
            this.#onMutexUp( mutex, ctx.clientId );

            return result( 500 );
        }

        // client is connected
        else {
            return result( 200, mutexId );
        }
    }

    async API_up ( ctx, mutexId ) {
        if ( !this.#mutexSet.has( mutexId ) ) return result( [500, `Mutex is not exists`] );

        const mutex = this.#mutexSet.get( mutexId );

        mutex.up();
        this.#onMutexUp( mutex, ctx.clientId );

        return result( 200, mutexId );
    }

    // private
    #onMutexUp ( mutex, clientId ) {
        if ( mutex.clientId && mutex.clientId !== clientId ) return;

        mutex.clientId = null;

        if ( this.#clientMutex[clientId] ) {
            this.#clientMutex[clientId].delete( mutex.id );
        }

        // destroy mutex
        if ( !mutex.isLocked ) mutex.destroy();
    }

    #onMutexDown ( mutex, clientId ) {
        mutex.clientId = clientId;

        this.#clientMutex[clientId] ||= new Set();
        this.#clientMutex[clientId].add( mutex.id );
    }
}
