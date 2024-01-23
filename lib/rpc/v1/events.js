export default Super =>
    class extends Super {

        // api
        API_publish ( ctx, clusterId, { name, users, data } = {} ) {
            this.api.publish( {
                "name": "/cluster/" + clusterId + "/" + name,
                users,
                "data": [ data ],
                "publisherId": ctx.connection.id,
            } );

            return result( 200 );
        }
    };
