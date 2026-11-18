export default Super =>
    class extends Super {

        // public
        [ "API_get-ip-address" ] ( ctx ) {
            return result( 200, ctx.remoteAddress );
        }
    };
