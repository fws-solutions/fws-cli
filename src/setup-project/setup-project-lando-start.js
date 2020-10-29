/**
 * Create Lando File
 *
 * @description CLI script for creating Lando recipe file.
 */
const colors = require('ansi-colors');
const helpers = require('../helpers');

module.exports = {
    projectName: '',
    hostName: '',
    spawnConfig: {},
    spinner: null,
    timeout: 1500,

    init: function(projectName) {
        this.projectName = projectName;
        this.hostName = helpers.createLandoHostName(projectName);
        this.spawnConfig = {
            stdio: 'inherit',
            cwd: process.cwd()
        };

        this.landoStart();
    },

    landoStart: function() {
        // run bash script with spawn - 'lando start'
        helpers.spawnScript(
            'lando',
            ['start'],
            this.spawnConfig,
            colors.cyan('%s ...getting ready for \'lando start\'...'),
            this.wpDbReset.bind(this)
        );
    },

    wpDbReset: function() {
        // run bash script with spawn - 'lando wp db reset'
        const scriptParams = [
            'wp',
            'db',
            'reset',
            '--yes'
        ];
        helpers.spawnScript(
            'lando',
            scriptParams,
            this.spawnConfig,
            colors.cyan('%s ...getting ready for \'wp db reset\'...'),
            this.wpCoreInstall.bind(this)
        );
    },

    wpCoreInstall: function() {
        // run bash script with spawn - 'lando wp core install'
        const scriptParams = [
            'wp',
            'core',
            'install',
            `--url=${this.hostName}`,
            `--title=${this.projectName}`,
            '--admin_user=admin',
            '--admin_password=admin',
            '--admin_email=hello@forwardslashny.com'
        ];
        helpers.spawnScript(
            'lando',
            scriptParams,
            this.spawnConfig,
            colors.cyan('%s ...getting ready for \'wp core install\'...')
        );
    }
};
