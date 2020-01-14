#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const helpers = require('../src/helpers');
const commander = require('commander');
const program = new commander.Command();
const svgIcons = require('../src/svg-icons');
const createFiles = require('../src/create-files');

const packageJsonDir = path.join(process.cwd(), '/package.json');
const packageJson = fs.existsSync(packageJsonDir) ? JSON.parse(fs.readFileSync(packageJsonDir, 'utf8')) : null;

if (!packageJson || !packageJson.forwardslash) {
    /*
    * Check if CLI is running in a Forwardslash project.  */
    helpers.consoleLogWarning('This directory does not support Forwardslash CLI', 'red', true);
} else {
    if (packageJson.forwardslash === 'starter_nuxt') {
        const NuxtCLI = require('../src/nuxt-commands');

        program.version('0.0.1');

        /*
        * Error on unknown commands.  */
        program.on('command:*', function () {
            console.error('Invalid command: %s', program.args.join(' '));
            helpers.consoleLogWarning('Invalid command! Type \'fws -h\' for a list of available commands.', 'red', true);
        });

        NuxtCLI.mapCommand(program, 'dev');
        NuxtCLI.mapCommand(program, 'build');
        NuxtCLI.mapCommand(program, 'start');
        NuxtCLI.mapCommand(program, 'generate');

        program
            .command('icons')
            .description('optimizes and generates SVG icons')
            .action(function () {
                svgIcons.init(packageJson.forwardslash);
            });

        program
            .command('create-file <name>')
            .alias('cf')
            .description('creates files')
            .option('-b, --block', 'create block component')
            .option('-p, --part', 'create part component')
            .action(function (arg, cmd) {
                createFiles.init(arg, cmd);
            });

        program.parse(process.argv);
    }
}


