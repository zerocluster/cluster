import Base from "#core/app/prototypes/base";
import * as uuid from "#core/uuid";

export default class extends Base {
    #id = uuid.v4();

    // api
    API_publish ( ctx, name, body ) {
        this.app.hub.publish( "rpc/out", name, body );

        return result( 200 );
    }
}
