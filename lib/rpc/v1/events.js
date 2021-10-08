import Base from "#app/prototypes/base";
import Events from "#core/events";
import msgpack from "#core/msgpack";

export default class extends Base {
    #events = new Events( { "maxListeners": Infinity } );
    #subscriptions = new Map();

    constructor ( api ) {
        super( api );

        this.app.on( "client/disconnect", client => {
            const subscription = this.#subscriptions.get( client );

            if ( !subscription ) return;

            // remove listeners
            for ( const event of subscription.events ) this.#events.off( event, subscription.listener );

            delete this.#subscriptions[client];
        } );
    }

    // api
    API_subscribe ( ctx, events ) {
        const client = ctx.client;

        var subscription = this.#subscriptions.get( client );

        if ( !subscription ) {
            subscription = {
                "listener": this.#listener.bind( this, client ),
                "events": new Set(),
            };

            this.#subscriptions.set( client, subscription );
        }

        const listener = subscription.listener;

        for ( const event of events ) {

            // already subscribed
            if ( subscription.events.has( event ) ) continue;

            subscription.events.add( event );
            this.#events.on( event, listener );
        }

        return result( 200 );
    }

    API_unsubscribe ( ctx, events ) {
        const subscription = this.#subscriptions.get( ctx.client );

        if ( subscription ) {
            for ( const event of events ) {
                if ( !subscription.events.has( event ) ) continue;

                subscription.events.delete( event );
                this.#events.off( event, subscription.listener );
            }
        }

        return result( 200 );
    }

    API_publish ( ctx, event, body ) {
        if ( this.#events.listenerCount( event ) ) {
            const msg = msgpack.encode( {
                "jsonrpc": "2.0",
                "method": "/event",
                "params": ["publish", event, body],
            } );

            this.#events.emit( event, ctx.client, msg );
        }

        return result( 200 );
    }

    // private
    #listener ( targetClient, sourceClient, msg ) {

        // do not send to published
        if ( targetClient === sourceClient ) return;

        targetClient.send( msg, true );
    }
}
