export default Super =>
    class extends Super {

        // api
        API_publish ( ctx, name, msg ) {
            this.api.forwardEvent( name, [msg], {}, ctx.connection.id );

            return result( 200 );
        }
    };
