/**
 * Configuration
 *
 * @description Configuration of FWS CLI commands.
 */
const fs = require('fs');
const path = require('path');
const helpers = require('../helpers');
const store = require('../store');
const svgIcons = require('../svg-icons');
const createFiles = require('../create-files');
const deleteFiles = require('../delete-files');
const postInstall = require('../postinstall');
const setupProject = require('../setup-project');
const w3Validator = require('../w3-validator');
const colors = require('ansi-colors');
const figlet = require('figlet');

module.exports = {
    program: null,
    packageJson: null,
    wpConfigSamplePath: null,
    themeName: '',
    starter: '',

    init: function(program) {
        // init config
        this.program = program;
        store.actions.setIsWin();
        store.actions.setProjectRoot();

        // wp config
        if (fs.existsSync(path.join(store.getters.getProjectRoot(), 'wp-content'))) {
            store.actions.setWpConfigSamplePath();
            store.actions.setWpThemePath();
            store.actions.setWpThemeName();

            this.wpConfigSamplePath = store.getters.getWpConfigSamplePath();
            this.themeName = store.getters.getWpThemeName();
        }

        // basic config
        store.actions.setPackageJsonPath();
        store.actions.setPackageJson();
        store.actions.setProjectName();

        this.packageJson = store.getters.getWpPackageJson();

        // limit commands to wp's root directory
        if (this.wpConfigSamplePath) {
            this.setupProject();
        }

        // w3 validator available from anywhere
        this.w3Validator();

        // check FWS CLI version
        this.checkCliLatestVersion();

        // limit commands to theme's root directory
        if (this.packageJson) {
            if (!this.packageJson.forwardslash) {
                helpers.consoleLogWarning('This directory does not support Forwardslash CLI', 'red', true);
            }

            store.mutations.setStarter(this.packageJson.forwardslash);
            this.starter = store.getters.getStarter();

            this.mappingCommands();
            this.crudFiles();
            this.universalCommands();
        }
    },

    crudFiles: function() {
        switch (this.starter) {
            case helpers.starterVue:
            case helpers.starterNuxt:
                this.program
                    .command('create-file <name>')
                    .alias('cf')
                    .description('create component files')
                    .option('-b, --block', 'create block component')
                    .option('-p, --part', 'create part component')
                    .action(function(arg, cmd) {
                        createFiles.init(arg, cmd);
                    });
                break;
            case helpers.starterTwig:
                this.program
                    .command('create-file <name>')
                    .alias('cf')
                    .description('create component files')
                    .option('-b, --block', 'create block component')
                    .option('-p, --part', 'create part component')
                    .option('-pg, --page', 'create page')
                    .action(function(arg, cmd) {
                        createFiles.init(arg, cmd);
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
                        createFiles.init(arg, cmd);
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
                helpers.mapCommand(this.program, null, 'vue-prod', 'runs production vue build');
                helpers.mapCommand(this.program, null, 'vue', 'runs development vue build');
                helpers.mapCommand(this.program, null, 'css', 'compiles CSS files');
                helpers.mapCommand(this.program, null, 'js', 'compiles JS files');
                helpers.mapCommand(this.program, null, 'lint-html', 'lint check of HTML files');
                helpers.mapCommand(this.program, null, 'lint-css', 'lint check of SCSS files');
                helpers.mapCommand(this.program, null, 'lint-js', 'lint check of JS files');
                break;
            default:
                helpers.consoleLogWarning('This is NOT a FWS Starter!!!', 'red');
        }
    },

    setupProject: function() {
        this.program
            .command('setup-wordpress')
            .alias('set-wp')
            .description('setup project using lando')
            .action(function() {
                setupProject.init();
            });
    },

    w3Validator: function() {
        this.program
            .command('w3-validator <url>')
            .alias('w3')
            .description('validate via w3 api')
            .option('--force-build', 'run w3 without build fail')
            .action(function(arg, cmd) {
                const options = Object.keys(cmd);

                w3Validator.init(arg);
            });
    },

    universalCommands: function() {
        const _this = this;

        this.program
            .command('icons')
            .description('optimizes and generates SVG icons')
            .action(function() {
                svgIcons.init();
            });

        this.program
            .command('postinstall')
            .description('runs postinstall script')
            .action(function() {
                postInstall.init();
            });

        this.program
            .command('npm-i')
            .alias('i')
            .description('install node modules')
            .action(function() {
                helpers.spawnScript(
                    store.data.isWin ? 'npm.cmd' : 'npm',
                    ['i'],
                    helpers.getSpawnConfig(),
                    colors.cyan('%s ...getting ready for \'npm install\'...'),
                    () => {
                        helpers.consoleLogWarning(`node_modules installed in the root of '${_this.themeName}' theme.`, 'cyan');
                    }
                );
            });
    },

    checkCliLatestVersion: function() {
        this.program
            .command('latest-version')
            .alias('latest')
            .description('check for latest CLI version')
            .action(function() {
                const cliVersion = helpers.quickSpawnScriptNPM(
                    ['view', '@fws/cli', 'version'],
                    true
                );

                cliVersion.then(data => {
                    const latestVersion = data.trim();
                    const localVersion = store.getters.getCliVersion();
                    const updateNeeded = latestVersion !== localVersion;
                    const message = `You${updateNeeded ? ' DO NOT' : ''} have the latest version of ${colors['magenta']('@fws/cli')} installed!`;
                    let report = '';

                    figlet(updateNeeded ? 'Update Needed!' : 'All Good!', {font: 'Small Slant'}, function(err, data) {
                        if (err) {
                            console.log('Something went wrong...');
                            console.dir(err);
                            return;
                        }

                        report += '\n' + colors[updateNeeded ? 'red' : 'cyan'](data);
                        report += '\n\n' + colors[updateNeeded ? 'red' : 'grey'](message);
                        report += '\n\n' + colors['cyan'](`Latest version: ${latestVersion}`);
                        report += '\n' + colors[updateNeeded ? 'red' : 'cyan'](`Local version: ${localVersion}`) + '\n';

                        console.log(report);
                        process.exit();
                    });
                });
            });
    }
};
