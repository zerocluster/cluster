#!/usr/bin/env node

import App from "#lib/app";

console.log( process.env.NODE_ENV );
console.log( process.env.NODE_OPTIONS );

await App.Cli.parse( App );

const app = new App();

const res = await app.run();

if ( !res.ok ) process.exit( 1 );
