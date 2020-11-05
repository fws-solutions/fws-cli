/**
 * Create WP Config File
 *
 * @description CLI script for creating wp-config.php file.
 */
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const helpers = require('../helpers');
const store = require('../store');

module.exports = {
    wpMigrateDbKey: '',
    wpConfigSamplePath: null,
    wpConfigDir: path.join(process.cwd(), '/wp-config.php'),
    wpConfig: null,
    saltApi: 'https://api.wordpress.org/secret-key/1.1/salt/',

    init: function(wpMigrateDbKey) {
        this.wpConfigSamplePath = store.getters.getWpConfigSamplePath();
        this.wpMigrateDbKey = wpMigrateDbKey;

        return this.createWPConfigFile();
    },

    createWPConfigFile: async function() {
        // exit if wp-config already exists
        if (fs.existsSync(this.wpConfigDir)) {
            return null;
        }

        // read wp-config-sample.php file
        this.wpConfig = fs.readFileSync(this.wpConfigSamplePath, 'utf8');

        // salts and licence
        const newSalts = await this.getSalts();
        const defaultSalts = fs.readFileSync(path.join(helpers.moduleDir, 'templates', 'temp-wp-salts-default.txt'), 'utf8');
        const migrateKey = `define( 'WPMDB_LICENCE', '${this.wpMigrateDbKey}' );`;
        const saltsRegEx = this.wpConfig.match(/^\/\*\*#@\+.*\/\*\*#@-\*\//sm);

        // prepare values for lando config
        this.wpConfig = this.findReplaceWPConfigFile('DB_NAME', 'database_name_here', 'wordpress');
        this.wpConfig = this.findReplaceWPConfigFile('DB_USER', 'username_here', 'wordpress');
        this.wpConfig = this.findReplaceWPConfigFile('DB_PASSWORD', 'password_here', 'wordpress');
        this.wpConfig = this.findReplaceWPConfigFile('DB_HOST', 'localhost', 'database');
        this.wpConfig = this.findReplaceWPConfigFile('WP_DEBUG', 'false', 'true', true);

        // replace salts and add migrate db pro licence
        const data = {
            salts: newSalts ? newSalts.data : defaultSalts,
            migrate: migrateKey
        };
        const compiledTemplateSalts = helpers.compileTemplate('temp-wp-salts-licence.txt', data);
        this.wpConfig = this.wpConfig.replace(saltsRegEx, compiledTemplateSalts);

        // create file
        fs.writeFileSync(this.wpConfigDir, this.wpConfig, 'utf8');

        return true;
    },

    findReplaceWPConfigFile: function(entry, oldVal, newVal, noQuote = false) {
        const oldDef = `define( '${entry}', ${this.noQuoteWrap(oldVal, noQuote)} );`;
        const newDef = `define( '${entry}', ${this.noQuoteWrap(newVal, noQuote)} );`;

        return this.wpConfig.replace(oldDef, newDef);
    },

    noQuoteWrap: function(word, noQuote) {
        return !noQuote ? `'${word}'` : word;
    },

    getSalts: async function() {
        try {
            return await axios.get(this.saltApi);
        } catch (error) {
            console.log(error);
            return '';
        }
    }
};
