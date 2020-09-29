/**
 * Configuration
 *
 * @description Configuration of FWS CLI commands.
 */
const helpers = require('../helpers');
const svgIcons = require('../svg-icons');
const createFiles = require('../create-files');
const deleteFiles = require('../delete-files');
const postInstall = require('../postinstall');

module.exports = {
    init: function(starter, program) {
        this.mappingCommands(starter, program);
        this.crudFiles(starter, program);
        this.universalCommands(starter, program);
    },

    crudFiles: function(starter, program) {
        switch (starter) {
            case helpers.starterVue:
            case helpers.starterNuxt:
                program
                    .command('create-file <name>')
                    .alias('cf')
                    .description('creates files')
                    .option('-b, --block', 'create block component')
                    .option('-p, --part', 'create part component')
                    .action(function(arg, cmd) {
                        createFiles.init(arg, cmd, starter);
                    });
                break;
            case helpers.starterTwig:
                program
                    .command('create-file <name>')
                    .alias('cf')
                    .description('creates files')
                    .option('-b, --block', 'create block component')
                    .option('-p, --part', 'create part component')
                    .option('-pg, --page', 'create page')
                    .action(function(arg, cmd) {
                        createFiles.init(arg, cmd, starter);
                    });
                break;
            case helpers.starterS:
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
                        createFiles.init(arg, cmd, starter);
                    });

                program
                    .command('remove-fe')
                    .alias('rfe')
                    .description('remove all _fe files in template-views dir')
                    .action(function() {
                        deleteFiles.init();
                    });
                break;
        }
    },

    mappingCommands: function(starter, program) {
        switch (starter) {
            case helpers.starterVue:
                helpers.mapCommand(program, null, 'dev', 'runs vue-cli-service serve script');
                helpers.mapCommand(program, null, 'build', 'runs vue-cli-service build script');
                helpers.mapCommand(program, null, 'lint', 'runs vue-cli-service lint script');
                helpers.mapCommand(program, 'story', 'storybook', 'runs storybook script');
                helpers.mapCommand(program, 'story-b', 'storybook-build', 'runs build-storybook script');
                break;
            case helpers.starterNuxt:
                helpers.mapCommand(program, null, 'dev', 'runs nuxt dev script');
                helpers.mapCommand(program, null, 'build', 'runs nuxt build script');
                helpers.mapCommand(program, 'gen', 'generate', 'runs nuxt generate script');
                helpers.mapCommand(program, null, 'start', 'runs nuxt start script');
                helpers.mapCommand(program, 'story', 'storybook', 'runs storybook script');
                helpers.mapCommand(program, 'story-b', 'storybook-build', 'runs build-storybook script');
                break;
            case helpers.starterTwig:
                helpers.mapCommand(program, null, 'dev', 'runs watch task');
                helpers.mapCommand(program, null, 'build-dev', 'runs development build');
                helpers.mapCommand(program, null, 'build', 'runs production build');
                helpers.mapCommand(program, null, 'twig', 'compiles Twig files');
                helpers.mapCommand(program, null, 'css', 'compiles CSS files');
                helpers.mapCommand(program, null, 'js', 'compiles JS files');
                helpers.mapCommand(program, null, 'lint-css', 'lint check of SCSS files');
                helpers.mapCommand(program, null, 'lint-js', 'lint check of JS files');
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
                break;
            default:
                helpers.consoleLogWarning('This is NOT a FWS Starter!!!', 'red');
        }
    },

    universalCommands: function(starter, program) {
        program
            .command('icons')
            .description('optimizes and generates SVG icons')
            .action(function() {
                svgIcons.init(starter);
            });

        program
            .command('postinstall')
            .description('runs postinstall script')
            .action(function() {
                postInstall.init(starter);
            });
    }
};
