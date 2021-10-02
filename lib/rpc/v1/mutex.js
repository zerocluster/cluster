import Base from "#app/prototypes/base";
import sql from "#core/sql";
import CacheLRU from "#core/cache-lru";
import datasets from "#lib/datasets";

console.log( 123 );

const CACHE = new CacheLRU( { "maxSize": 1000 } );

const QUERIES = {
    "get": sql`SELECT * FROM "continent" WHERE "id" = ? OR "name" LIKE ?`.prepare(),
    "get_all": sql`SELECT * FROM "continent"`.prepare(),
};

var dbhDatasets = await datasets.dbh( "datasets" );

export default class extends Base {
    constructor ( api ) {
        super( api );

        // set update listener
        datasets.on( "update", async dataset => {
            if ( dataset === "datasets" ) {
                dbhDatasets = await datasets.dbh( "datasets" );

                CACHE.reset();
            }
        } );
    }

    async API_get ( ctx, id ) {
        id = id.toUpperCase();

        var res = CACHE.get( id );

        if ( res ) return res;

        res = dbhDatasets.selectRow( QUERIES.get, [id, id] );

        CACHE.set( id, res );

        return res;
    }

    async API_get_all ( ctx ) {
        return dbhDatasets.select( QUERIES.get_all );
    }
}
