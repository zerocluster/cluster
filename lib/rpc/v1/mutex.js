import Base from "#core/app/prototypes/base";
import Mutex from "#core/threads/mutex";
import * as uuid from "#core/uuid";

export default class extends Base {
    #mutexSet = new Mutex.Set();
    #connectionMutex = {};

    constructor ( api ) {
        super( api );

        this.app.on( "client/disconnect", connection => {

            // connection has no mutexes
            if ( !this.#connectionMutex[connection.id] ) return;

            for ( const mutexId of this.#connectionMutex[connection.id] ) {
                const mutex = this.#mutexSet.get( mutexId );

                mutex.up();
                this.#onMutexUp( mutex, connection.id );
            }

            delete this.#connectionMutex[connection.id];
        } );
    }

    async API_isLocked ( ctx, mutexId ) {
        return result( 200, this.#mutexSet.has( mutexId ) && this.#mutexSet.get( mutexId ).isLocked );
    }

    async API_tryDown ( ctx, mutexId ) {
        mutexId ||= uuid.v4();

        const mutex = this.#mutexSet.get( mutexId );

        // mutex down
        if ( mutex.tryDown() ) {
            this.#onMutexDown( mutex, ctx.connection.id );

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
        this.#onMutexDown( mutex, ctx.connection.id );

        // client was disconnected
        if ( !ctx.connection.isConnected ) {
            mutex.up();
            this.#onMutexUp( mutex, ctx.connection.id );

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
        this.#onMutexUp( mutex, ctx.connection.id );

        return result( 200, mutexId );
    }

    // private
    #onMutexUp ( mutex, connectionId ) {
        if ( mutex.connectionId && mutex.connectionId !== connectionId ) return;

        mutex.connectionId = null;

        if ( this.#connectionMutex[connectionId] ) {
            this.#connectionMutex[connectionId].delete( mutex.id );
        }

        // delete mutex
        if ( !mutex.isLocked ) this.#mutexSet.delete( mutex );
    }

    #onMutexDown ( mutex, connectionId ) {
        mutex.connectionId = connectionId;

        this.#connectionMutex[connectionId] ||= new Set();
        this.#connectionMutex[connectionId].add( mutex.id );
    }
}
