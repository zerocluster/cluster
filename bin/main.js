#!/usr/bin/env node

import App from "#lib/app";

await App.Cli.parse( App );

const app = new App();

const res = await app.run();

if ( !res.ok ) process.exit( 1 );

// console.log( process.env );
console.log( "NODE_ENV", process.env.NODE_ENV );
console.log( "NODE_OPTIONS", process.env.NODE_OPTIONS );
process.exit();
