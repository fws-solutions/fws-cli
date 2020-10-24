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
const landoSetup = require('../lando-setup');
const w3Validator = require('../w3-validator');

module.exports = {
    program: null,
    packageJson: null,
    wpConfigSample: null,
    starter: '',

    init: function(program) {
        this.program = program;
        this.packageJson = helpers.getPackageJson();
        this.wpConfigSample = helpers.getWPConfigSample();

        // w3 validator available from anywhere
        this.w3Validator();

        // limit commands to wp's root directory
        if (this.wpConfigSample) {
            this.landoSetup();
        }

        // limit commands to theme's root directory
        if (this.packageJson) {
            if (!this.packageJson.forwardslash) {
                helpers.consoleLogWarning('This directory does not support Forwardslash CLI', 'red', true);
            }

            this.starter = this.packageJson.forwardslash;

            this.mappingCommands();
            this.crudFiles();
            this.universalCommands();
        }
    },

    crudFiles: function() {
        const _this = this;

        switch (this.starter) {
            case helpers.starterVue:
            case helpers.starterNuxt:
                this.program
                    .command('create-file <name>')
                    .alias('cf')
                    .description('creates files')
                    .option('-b, --block', 'create block component')
                    .option('-p, --part', 'create part component')
                    .action(function(arg, cmd) {
                        createFiles.init(arg, cmd, _this.starter);
                    });
                break;
            case helpers.starterTwig:
                this.program
                    .command('create-file <name>')
                    .alias('cf')
                    .description('creates files')
                    .option('-b, --block', 'create block component')
                    .option('-p, --part', 'create part component')
                    .option('-pg, --page', 'create page')
                    .action(function(arg, cmd) {
                        createFiles.init(arg, cmd, _this.starter);
                    });
                break;
            case helpers.starterS:
                this.program
                    .command('create-file <name>')
                    .alias('cf')
                    .description('creates files')
                    .option('-b, --block', 'create template-view block')
                    .option('-p, --part', 'create template-view part')
                    .option('-l, --listing', 'create template-view listing')
                    .option('-B, --block-vue', 'create vue block')
                    .option('-P, --part-vue', 'create vue part')
                    .action(function(arg, cmd) {
                        createFiles.init(arg, cmd, _this.starter);
                    });

                this.program
                    .command('remove-fe')
                    .alias('rfe')
                    .description('remove all _fe files in template-views dir')
                    .action(function() {
                        deleteFiles.init();
                    });
                break;
        }
    },

    mappingCommands: function() {
        switch (this.starter) {
            case helpers.starterVue:
                helpers.mapCommand(this.program, null, 'dev', 'runs vue-cli-service serve script');
                helpers.mapCommand(this.program, null, 'build', 'runs vue-cli-service build script');
                helpers.mapCommand(this.program, null, 'lint', 'runs vue-cli-service lint script');
                helpers.mapCommand(this.program, 'story', 'storybook', 'runs storybook script');
                helpers.mapCommand(this.program, 'story-b', 'storybook-build', 'runs build-storybook script');
                break;
            case helpers.starterNuxt:
                helpers.mapCommand(this.program, null, 'dev', 'runs nuxt dev script');
                helpers.mapCommand(this.program, null, 'build', 'runs nuxt build script');
                helpers.mapCommand(this.program, 'gen', 'generate', 'runs nuxt generate script');
                helpers.mapCommand(this.program, null, 'start', 'runs nuxt start script');
                helpers.mapCommand(this.program, 'story', 'storybook', 'runs storybook script');
                helpers.mapCommand(this.program, 'story-b', 'storybook-build', 'runs build-storybook script');
                break;
            case helpers.starterTwig:
                helpers.mapCommand(this.program, null, 'dev', 'runs watch task');
                helpers.mapCommand(this.program, null, 'build-dev', 'runs development build');
                helpers.mapCommand(this.program, null, 'build', 'runs production build');
                helpers.mapCommand(this.program, null, 'twig', 'compiles Twig files');
                helpers.mapCommand(this.program, null, 'css', 'compiles CSS files');
                helpers.mapCommand(this.program, null, 'js', 'compiles JS files');
                helpers.mapCommand(this.program, null, 'lint-css', 'lint check of SCSS files');
                helpers.mapCommand(this.program, null, 'lint-js', 'lint check of JS files');
                break;
            case helpers.starterS:
                helpers.mapCommand(this.program, null, 'dev', 'runs watch task');
                helpers.mapCommand(this.program, null, 'build-dev', 'runs development build');
                helpers.mapCommand(this.program, null, 'build', 'runs production build');
                helpers.mapCommand(this.program, null, 'vue', 'runs development vue build');
                helpers.mapCommand(this.program, null, 'css', 'compiles CSS files');
                helpers.mapCommand(this.program, null, 'js', 'compiles JS files');
                helpers.mapCommand(this.program, null, 'lint-html', 'lint check of HTML files');
                helpers.mapCommand(this.program, null, 'lint-css', 'lint check of SCSS files');
                helpers.mapCommand(this.program, null, 'lint-js', 'lint check of JS files');
                helpers.mapCommand(this.program, null, 'w3-local', 'validate via w3 api');
                break;
            default:
                helpers.consoleLogWarning('This is NOT a FWS Starter!!!', 'red');
        }
    },

    landoSetup: function() {
        const _this = this;

        this.program
            .command('lando-setup')
            .alias('lndo')
            .description('setup project using lando')
            .action(function() {
                landoSetup.init(_this.wpConfigSample);
            });
    },

    w3Validator: function() {
        this.program
            .command('w3-validator <url>')
            .alias('w3')
            .description('validate via w3 api')
            .option('--force-build', 'run w3 without build fail')
            .action(function(arg, cmd) {
                let options = helpers.cleanCmdArgs(cmd);
                options = Object.keys(options);

                w3Validator.init(arg);
            });
    },

    universalCommands: function() {
        const _this = this;

        this.program
            .command('icons')
            .description('optimizes and generates SVG icons')
            .action(function() {
                svgIcons.init(_this.starter);
            });

        this.program
            .command('postinstall')
            .description('runs postinstall script')
            .action(function() {
                postInstall.init(_this.starter);
            });
    }
};
