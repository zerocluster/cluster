#!/usr/bin/env node

import App from "#lib/app";

await App.CLI.parse( App );

const app = new App();

const res = await app.run();

if ( !res.ok ) process.exit( 1 );
