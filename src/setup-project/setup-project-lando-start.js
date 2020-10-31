/**
 * Create Lando File
 *
 * @description CLI script for creating Lando recipe file.
 */
const colors = require('ansi-colors');
const helpers = require('../helpers');

module.exports = {
    projectName: '',
    devServer: '',
    devSecretKey: '',
    hostName: '',
    wpAdminUser: 'admin',
    wpAdminPass: 'admin',
    wpAdminEmail: 'hello@forwardslashny.com',
    spawnConfig: {},

    init: function(projectName, devServer, devSecretKey) {
        this.projectName = projectName;
        this.devSecretKey = devSecretKey;
        this.devServer = devServer;
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
            this.getSpinnerTitle('lando start'),
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
            this.getSpinnerTitle('wp db reset'),
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
            `--admin_user=${this.wpAdminUser}`,
            `--admin_password=${this.wpAdminPass}`,
            `--admin_email=${this.wpAdminEmail}`
        ];
        helpers.spawnScript(
            'lando',
            scriptParams,
            this.spawnConfig,
            this.getSpinnerTitle('wp core install'),
            this.wpActivatePlugins.bind(this)
        );
    },

    wpActivatePlugins: function() {
        // run bash script with spawn - 'lando wp core install'
        const scriptParams = [
            'wp',
            'plugin',
            'activate',
            'wp-migrate-db-pro',
            'wp-migrate-db-pro-cli',
            'wp-migrate-db-pro-media-files',
            'wp-migrate-db-pro-theme-plugin-files'
        ];
        helpers.spawnScript(
            'lando',
            scriptParams,
            this.spawnConfig,
            this.getSpinnerTitle('wp plugin activate'),
            this.wpMigrateDbPull.bind(this)
        );
    },

    wpMigrateDbPull: function() {
        // run bash script with spawn - 'lando wp core install'
        const scriptParams = [
            'wp',
            'migratedb',
            'pull',
            `https://${this.devServer}`,
            this.devSecretKey,
            `--find=//${this.devServer}`,
            `--replace=//${this.hostName}`
        ];
        helpers.spawnScript(
            'lando',
            scriptParams,
            this.spawnConfig,
            this.getSpinnerTitle('wp migrate db pull')
        );
    },

    getSpinnerTitle: function(title) {
        const colorTitle = colors.magenta(title);
        return colors.cyan(`%s ...getting ready for '${colorTitle}'...`);
    }
};
