export default Super =>
    class extends Super {

        // api
        API_publish ( ctx, clusterId, event = {} ) {
            event.name = clusterId + "/" + event.name;

            event.publisherId = ctx.connection.id;

            this.api.publish( event );

            return result( 200 );
        }
    };
