export default Super =>
    class extends Super {

        // api
        API_publish ( ctx, name, msg ) {
            this.api.frontend.publish( {
                name,
                "arguments": [msg],
                "publisherId": ctx.connection.id,
            } );

            return result( 200 );
        }
    };
