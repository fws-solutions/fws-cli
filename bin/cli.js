#!/usr/bin/env node
const config = require('../src/config');
const helpers = require('../src/helpers');
const commander = require('commander');
const store = require('../src/store');

/*
* Init FWS CLI. */
const program = new commander.Command();
program.version(store.getters.getCliVersion());

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
