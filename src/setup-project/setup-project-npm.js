/**
 * Install NPM
 *
 * @description CLI script for installing node_modules in theme's root directory.
 */
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const colors = require('ansi-colors');
const spinner = require('cli-spinner').Spinner;
const helpers = require('../helpers');

module.exports = {
    wpThemeDir: '',
    themeName: '',
    spawnConfig: {},
    spinner: null,
    timeout: 1500,
    callback: null,

    init: function(themeName, wpThemeDir, callback) {
        this.callback = callback;
        this.spinner = new spinner();
        this.spinner.setSpinnerString('|/-\\');

        this.themeName = themeName;
        this.wpThemeDir = path.join(wpThemeDir, themeName);
        this.spawnConfig = {
            stdio: 'inherit',
            cwd: this.wpThemeDir
        }

        this.npmInstall();
    },

    npmInstall: function() {
        const _this = this;

        // exit if node_modules already exists
        if (fs.existsSync(path.join(this.wpThemeDir, 'node_modules'))) {
            helpers.consoleLogWarning(`node_modules already installed in the root of '${this.themeName}' theme.`);
            this.buildFiles();
            return null;
        }

        this.spinner.setSpinnerTitle(colors.cyan('%s ...getting ready for \'npm install\'...'));
        console.log('\n');
        this.spinner.start();

        setTimeout(() => {
            this.spinner.stop();
            console.log('\n');

            const npmInstall = spawn('npm', ['i'], this.spawnConfig);

            npmInstall.on('close', (code) => {
                helpers.consoleLogWarning(`node_modules installed in the root of '${this.themeName}' theme.`, 'green');
                _this.buildFiles();
            });
        }, this.timeout);
    },

    buildFiles: function() {
        const _this = this;

        this.spinner.setSpinnerTitle(colors.cyan('%s ...getting ready for \'fws build-dev\'...'));
        console.log('\n');
        this.spinner.start();

        setTimeout(() => {
            this.spinner.stop();
            console.log('\n');

            const build = spawn('npm', ['run', 'build-dev'], this.spawnConfig);

            build.on('close', (code) => {
                helpers.consoleLogWarning(`Gulp build and vue build done!`, 'green');

                if (!_this.callback) {
                    process.exit(code);
                }

                _this.callback.init();
            });
        }, this.timeout);
    }
};
