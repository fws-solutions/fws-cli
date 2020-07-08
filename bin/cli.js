#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const config = require('../src/config');
const helpers = require('../src/helpers');
const commander = require('commander');
const w3Validator = require('../src/w3-validator');

const program = new commander.Command();
const packageJsonDir = path.join(process.cwd(), '/package.json');
const packageJson = fs.existsSync(packageJsonDir) ? JSON.parse(fs.readFileSync(packageJsonDir, 'utf8')) : null;
let w3Command = false;

program.version('0.6.0');

program
    .command('w3-validator <url>')
    .alias('w3')
    .description('validate via w3 api')
    .option('--force-build', 'run w3 without build fail')
    .action(function(arg, cmd) {
        w3Command = true;
        let options = helpers.cleanCmdArgs(cmd);
        options = Object.keys(options);

        w3Validator.init(arg);
    });

if (!packageJson || !packageJson.forwardslash) {
    program.parse(process.argv);

    /*
    * Check if CLI is running in a Forwardslash project.  */
    if (!w3Command) {
        // skip error msg if executed w3-validator command
        w3Command = false;
        helpers.consoleLogWarning('This directory does not support Forwardslash CLI', 'red', true);
    }
} else {
    /*
    * Error on unknown commands.  */
    program.on('command:*', function() {
        console.error('Invalid command: %s', program.args.join(' '));
        helpers.consoleLogWarning('Invalid command! Type \'fws -h\' for a list of available commands.', 'red', true);
    });

    /*
    * Run CLI configuration.  */
    config.init(packageJson.forwardslash, program);

    program.parse(process.argv);
}


