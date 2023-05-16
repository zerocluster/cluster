import Mutex from "#core/threads/mutex";
import uuidV4 from "#core/uuid";

export default Super =>
    class extends Super {
        #mutexSet = new Mutex.Set();
        #connectionLockedMutexes = {};

        constructor ( api ) {
            super( api );

            this.app.on( "rpc/disconnect", this.#onDisconnect.bind( this ) );
        }

        async API_isLocked ( ctx, mutexId ) {
            if ( !this.#mutexSet.has( mutexId ) ) return result( 200, false );

            return result( 200, this.#mutexSet.get( mutexId ).isLocked );
        }

        async API_tryLock ( ctx, mutexId ) {
            const mutex = this.#mutexSet.get( mutexId );

            // locked
            if ( mutex.tryLock() ) {
                if ( ctx.connection.isConnected ) {
                    this.#onLock( ctx.connection, mutex );

                    return result( 200, mutex.lockId );
                }
                else {
                    mutex.unlock();

                    return result( 200 );
                }
            }

            // not locked
            else {
                return result( 200, false );
            }
        }

        async API_lock ( ctx, mutexId ) {
            const mutex = this.#mutexSet.get( mutexId );

            await mutex.lock();

            if ( ctx.connection.isConnected ) {
                this.#onLock( ctx.connection, mutex );

                return result( 200, mutex.lockId );
            }
            else {
                mutex.unlock();

                return result( 200 );
            }
        }

        async API_unlock ( ctx, mutexId, lockId ) {
            if ( !this.#mutexSet.has( mutexId ) ) return result( 200, true );

            const mutex = this.#mutexSet.get( mutexId );

            if ( !mutex.isLocked ) return result( 200, true );

            // lock id is invalid
            if ( mutex.lockId !== lockId ) return result( 200, false );

            this.#unlock( ctx.connection, mutex );

            return result( 200, true );
        }

        // private
        #onDisconnect ( connection ) {
            const connectionLockedMutexes = this.#connectionLockedMutexes[connection.id];

            if ( connectionLockedMutexes ) {
                for ( const mutex of connectionLockedMutexes.values() ) {
                    this.#unlock( connection, mutex );
                }
            }
        }

        #onLock ( connection, mutex ) {
            const lockId = uuidV4();

            mutex.lockId = lockId;

            this.#connectionLockedMutexes[connection.id] ??= new Map();
            this.#connectionLockedMutexes[connection.id].set( mutex.id, mutex );
        }

        #unlock ( connection, mutex ) {
            mutex.lockId = null;

            if ( this.#connectionLockedMutexes[connection.id] ) {
                this.#connectionLockedMutexes[connection.id].delete( mutex.id );

                if ( !this.#connectionLockedMutexes[connection.id].size ) {
                    delete this.#connectionLockedMutexes[connection.id];
                }
            }

            mutex.unlock();
        }
    };
