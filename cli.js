#!/usr/bin/env node

var DebugServer = require('node-inspector/lib/debug-server').DebugServer;
var spawn = require('child_process').spawn;
var open = require('open');
var fs = require('fs');

var debugServer = new DebugServer();
debugServer.on('close', function () {
  console.log('session closed');
  process.exit();
});

var config = {
  "webPort": 8082,
  "webHost": null,
  "debugPort": 5858,
  "saveLiveEdit": false,
  "hidden": []
};


debugServer.start(config);

var args = [
  '--debug-brk',
  'node_modules/jasmine/bin/jasmine.js'
];

if (process.argv.length > 2) {
  args.push(process.argv.slice(2));
}

args.forEach(function(arg) {
    if (/\.js$/.test(arg) && !fs.existsSync(arg)) {
        console.log(arg + ": File not found.");
        process.exit(1);
    }
});

spawn('node', args);
open('http://localhost:' + config.webPort + '/debug?port=' + config.debugPort);
