#!/usr/bin/env node
const config = require('../src/config');
const helpers = require('../src/helpers');
const commander = require('commander');

/*
* Init FWS CLI. */
const program = new commander.Command();
program.version('0.3.0');

/*
* Error on unknown commands. */
program.on('command:*', function() {
    const errorMsg = `Invalid FWS Command: '${program.args.join(' ')}'!\n    Type 'fws -h' for a list of available commands.`;
    helpers.consoleLogWarning(errorMsg, 'red', true);
});

/*
* Run CLI configuration. */
config.init(program);
program.parse(process.argv);
