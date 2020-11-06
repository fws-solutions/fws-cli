/**
 * Create Lando File
 *
 * @description CLI script for creating Lando recipe file.
 */
const colors = require('ansi-colors');
const figlet = require('figlet');
const helpers = require('../helpers');
const store = require('../store');

module.exports = {
    projectName: '',
    devServer: '',
    devSecretKey: '',
    hostName: '',
    wpAdminUser: 'admin',
    wpAdminPass: 'admin',
    wpAdminEmail: 'hello@forwardslashny.com',
    protocol: 'https',
    spawnConfig: {},

    init: function(devServer, devSecretKey) {
        this.projectName = store.getters.getProjectName();
        this.devSecretKey = devSecretKey;
        this.devServer = devServer;
        this.hostName = helpers.createLandoHostName(this.projectName);
        this.spawnConfig = {
            stdio: 'inherit',
            cwd: store.getters.getProjectRoot()
        };

        const landoStartCallback = this.wpDbReset.bind(this);
        this.landoStart(landoStartCallback);
    },

    landoStart: function(callback) {
        // run bash script with spawn - 'lando start'
        helpers.spawnScript(
            'lando',
            ['start'],
            this.spawnConfig,
            this.getSpinnerTitle('lando start'),
            callback
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
        // run bash script with spawn - 'lando wp plugin activate'
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
        // run bash script with spawn - 'lando wp migratedb pull'
        const scriptParams = [
            'wp',
            'migratedb',
            'pull',
            `${this.protocol}://${this.devServer}`,
            this.devSecretKey,
            `--find=//${this.devServer}`,
            `--replace=//${this.hostName}`
        ];

        const landoStartCallback = this.setupAllDone.bind(this);

        helpers.spawnScript(
            'lando',
            scriptParams,
            this.spawnConfig,
            this.getSpinnerTitle('wp migrate db pull'),
            this.landoStart.bind(this, landoStartCallback)
        );
    },

    getSpinnerTitle: function(title) {
        const colorTitle = colors.magenta(title);
        return colors.cyan(`%s ...getting ready for '${colorTitle}'...`);
    },

    setupAllDone: function() {
        figlet('All Done!', {font: 'Small Slant'}, function(err, data) {
            if (err) {
                console.log('Something went wrong...');
                console.dir(err);
                return;
            }
            console.log(colors['red'](data));

            process.exit();
        });
    }
};
