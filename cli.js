#!/usr/bin/env node

var DebugServer = require('node-inspector/lib/debug-server').DebugServer;
var config = require('node-inspector/lib/config');
var spawn = require('child_process').spawn;
var open = require('open');
var fs = require('fs');

var debugServer = new DebugServer();
debugServer.on('close', function () {
  console.log('session closed');
  process.exit();
});

debugServer.start(config);

var args = [
  '--debug-brk',
  'node_modules/jasmine-node/lib/jasmine-node/cli.js'
];

if (process.argv.length > 2) {
  args.push(process.argv.slice(2));
} else {
  args.push('spec/index.spec.js');
}

args.forEach(function(arg) {
    if (/\.js$/.test(arg) && !fs.existsSync(arg)) {
        console.log(arg + ": File not found.");
        process.exit(1);
    }
});

spawn('node', args);
open('http://localhost:' + config.webPort + '/debug?port=' + config.debugPort);
