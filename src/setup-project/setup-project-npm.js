/**
 * Install NPM
 *
 * @description CLI script for installing node_modules in theme's root directory.
 */
const fs = require('fs');
const path = require('path');
const colors = require('ansi-colors');
const helpers = require('../helpers');
const store = require('../store');

module.exports = {
    wpThemeDir: '',
    wpThemePath: '',
    themeName: '',
    spawnConfig: {},
    spinner: null,
    timeout: 1500,
    callback: null,

    init: function(callback) {
        this.callback = callback;
        this.themeName = store.getters.getWpThemeName();
        this.wpThemePath = store.getters.getWpThemePath()
        this.wpThemeDir = path.join(this.wpThemePath, this.themeName);
        this.spawnConfig = {
            stdio: 'inherit',
            cwd: this.wpThemeDir
        };

        this.npmInstall();
    },

    npmInstall: function() {
        // exit if node_modules already exists
        if (fs.existsSync(path.join(this.wpThemeDir, 'node_modules'))) {
            helpers.consoleLogWarning(`node_modules already installed in the root of '${this.themeName}' theme.`);
            this.buildFiles();
            return null;
        }

        // run bash script with spawn - 'npm i'
        helpers.spawnScript(
            'npm',
            ['i'],
            this.spawnConfig,
            colors.cyan('%s ...getting ready for \'npm install\'...'),
            () => {
                helpers.consoleLogWarning(`node_modules installed in the root of '${this.themeName}' theme.`, 'green');
                this.buildFiles();
            }
        );
    },

    buildFiles: function() {
        // run bash script with spawn - 'npm run build-dev'
        helpers.spawnScript(
            'npm',
            ['run', 'build-dev'],
            this.spawnConfig,
            colors.cyan('%s ...getting ready for \'fws build-dev\'...'),
            () => {
                helpers.consoleLogWarning(`Gulp build and vue build done!`, 'green');

                if (!this.callback) {
                    process.exit(0);
                }

                this.callback();
            }
        );
    }
};
