import Mutex from "#core/threads/mutex";

export default Super =>
    class extends Super {
        #mutexSet = new Mutex.Set();
        #connectionMutexes = {};

        constructor ( api ) {
            super( api );

            this.app.on( "rpc/disconnect", connection => {
                const connectionMutexes = this.#connectionMutexes[connection.id];

                if ( connectionMutexes ) {
                    for ( const mutex of connectionMutexes ) {
                        mutex.connection = null;

                        mutex.unlock();
                    }

                    delete this.#connectionMutexes[connection.id];
                }
            } );
        }

        async API_isLocked ( ctx, mutexId ) {
            if ( !this.#mutexSet.has( mutexId ) ) return result( 200, false );

            return result( 200, this.#mutexSet.get( mutexId ).isLocked );
        }

        async API_tryLock ( ctx, mutexId ) {
            const mutex = this.#mutexSet.get( mutexId );

            if ( mutex.tryLock() ) {
                this.#setMutexConnection( mutex, ctx.connection );

                return result( 200, mutex.id );
            }
            else {
                return result( 500, mutexId );
            }
        }

        async API_lock ( ctx, mutexId ) {
            const mutex = this.#mutexSet.get( mutexId );

            await mutex.lock();

            if ( ctx.connection.isConnected ) {
                this.#setMutexConnection( mutex, ctx.connection );
            }
            else {
                mutex.unlock();
            }

            return result( 200, mutex.id );
        }

        async API_unlock ( ctx, mutexId ) {
            if ( !this.#mutexSet.has( mutexId ) ) return result( 200 );

            const mutex = this.#mutexSet.get( mutexId );

            if ( !mutex.connection ) {
                return result( 200, mutex.id );
            }
            else if ( mutex.connection.id === ctx.connection.id ) {
                this.#connectionMutexes[mutex.connection.id].delete( mutex );

                mutex.connection = null;

                mutex.unlock();

                return result( 200, mutex.id );
            }
            else {
                return result( [500, `Mutex is locked by other connection`], mutex.id );
            }
        }

        // private
        #setMutexConnection ( mutex, connection ) {
            mutex.connection = connection;

            ( this.#connectionMutexes[connection.id] ||= new Set() ).add( mutex );
        }
    };
