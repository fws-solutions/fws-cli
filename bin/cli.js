#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const helpers = require('../src/helpers');
const commander = require('commander');
const svgIcons = require('../src/svg-icons');
const createFiles = require('../src/create-files');
const deleteFiles = require('../src/delete-files');
const w3Validator = require('../src/w3-validator');
const postInstall = require('../src/postinstall');

const program = new commander.Command();
const packageJsonDir = path.join(process.cwd(), '/package.json');
const packageJson = fs.existsSync(packageJsonDir) ? JSON.parse(fs.readFileSync(packageJsonDir, 'utf8')) : null;
let w3Command = false;

program.version('0.5.9');

program
    .command('w3-validator <url>')
    .alias('w3')
    .description('validate via w3 api')
    .action(function(arg) {
        w3Command = true;
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

    program
        .command('icons')
        .description('optimizes and generates SVG icons')
        .action(function() {
            svgIcons.init(packageJson.forwardslash);
        });

    switch (packageJson.forwardslash) {
        case helpers.starterNuxt:
            helpers.mapCommand(program, null, 'dev', 'runs nuxt dev script');
            helpers.mapCommand(program, null, 'build', 'runs nuxt build script');
            helpers.mapCommand(program, 'gen', 'generate', 'runs nuxt generate script');
            helpers.mapCommand(program, null, 'start', 'runs nuxt start script');
            helpers.mapCommand(program, 'story', 'storybook', 'runs storybook script');
            helpers.mapCommand(program, 'story-b', 'storybook-build', 'runs build-storybook script');

            program
                .command('postinstall')
                .description('runs postinstall script')
                .action(function() {
                    postInstall.init();
                });

            program
                .command('create-file <name>')
                .alias('cf')
                .description('creates files')
                .option('-b, --block', 'create block component')
                .option('-p, --part', 'create part component')
                .action(function(arg, cmd) {
                    createFiles.init(arg, cmd, helpers.starterNuxt);
                });
            break;
        case helpers.starterS:
            helpers.mapCommand(program, null, 'dev', 'runs watch task');
            helpers.mapCommand(program, null, 'build-dev', 'runs development build');
            helpers.mapCommand(program, null, 'build', 'runs production build');
            helpers.mapCommand(program, null, 'css', 'compiles CSS files');
            helpers.mapCommand(program, null, 'js', 'compiles JS files');
            helpers.mapCommand(program, null, 'lint-html', 'lint check of HTML files');
            helpers.mapCommand(program, null, 'lint-css', 'lint check of SCSS files');
            helpers.mapCommand(program, null, 'lint-js', 'lint check of JS files');
            helpers.mapCommand(program, null, 'w3-local', 'validate via w3 api');

            program
                .command('create-file <name>')
                .alias('cf')
                .description('creates files')
                .option('-b, --block', 'create template-view block')
                .option('-p, --part', 'create template-view part')
                .option('-l, --listing', 'create template-view listing')
                .option('-B, --block-vue', 'create vue block')
                .option('-P, --part-vue', 'create vue part')
                .action(function(arg, cmd) {
                    createFiles.init(arg, cmd, helpers.starterS);
                });

            program
                .command('remove-fe')
                .alias('rfe')
                .description('remove all _fe files in template-views dir')
                .action(function() {
                    deleteFiles.init();
                });
            break;
        default:
            helpers.consoleLogWarning('This is an unknown Starter!', 'red');
    }

    program.parse(process.argv);
}


