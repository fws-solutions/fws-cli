#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const helpers = require('../src/helpers');
const commander = require('commander');
const svgIcons = require('../src/svg-icons');
const createFiles = require('../src/create-files');

const program = new commander.Command();
const packageJsonDir = path.join(process.cwd(), '/package.json');
const packageJson = fs.existsSync(packageJsonDir) ? JSON.parse(fs.readFileSync(packageJsonDir, 'utf8')) : null;

if (!packageJson || !packageJson.forwardslash) {
    /*
    * Check if CLI is running in a Forwardslash project.  */
    helpers.consoleLogWarning('This directory does not support Forwardslash CLI', 'red', true);
} else {
    program.version('0.0.1');

    /*
    * Error on unknown commands.  */
    program.on('command:*', function () {
        console.error('Invalid command: %s', program.args.join(' '));
        helpers.consoleLogWarning('Invalid command! Type \'fws -h\' for a list of available commands.', 'red', true);
    });

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
            createFiles.init(arg, cmd, packageJson.forwardslash);
        });

    switch (packageJson.forwardslash) {
        case 'fws_starter_nuxt':
            helpers.mapCommand(program, 'dev', 'runs nuxt dev script');
            helpers.mapCommand(program, 'build', 'runs nuxt dev script');
            helpers.mapCommand(program, 'start', 'runs nuxt dev script');
            helpers.mapCommand(program, 'generate', 'runs nuxt dev script');
            break;
        case 'fws_starter_s':
            helpers.mapCommand(program, 'dev', 'runs watch task');
            helpers.mapCommand(program, 'build-dev', 'runs development build');
            helpers.mapCommand(program, 'build', 'runs production build');
            helpers.mapCommand(program, 'css', 'compiles CSS files');
            helpers.mapCommand(program, 'js', 'compiles JS files');
            helpers.mapCommand(program, 'w3', 'runs W3 validator');
            helpers.mapCommand(program, 'lint-html', 'lint check of HTML files');
            helpers.mapCommand(program, 'lint-css', 'lint check of SCSS files');
            helpers.mapCommand(program, 'lint-js', 'lint check of JS files');
            helpers.mapCommand(program, 'remove-fe', 'removes all fe files from template-views directories');
            break;
        default:
            helpers.consoleLogWarning('This is an unknown Starter!', 'red');
    }

    program.parse(process.argv);
}


