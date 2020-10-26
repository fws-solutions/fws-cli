/**
 * Create WP Config File
 *
 * @description CLI script for creating wp-config.php file.
 */
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const helpers = require('../helpers');

module.exports = {
    wpMigrateDbKey: '',
    wpConfigSample: null,
    wpConfigDir: path.join(process.cwd(), '/wp-config.php'),
    wpConfig: null,
    saltApi: 'https://api.wordpress.org/secret-key/1.1/salt/',

    init: function(wpConfigSample) {
        this.wpConfigSample = wpConfigSample;
        return this.createWPConfigFile();
    },

    createWPConfigFile: async function() {
        // exit if wp-config already exists
        if (fs.existsSync(this.wpConfigDir)) {
            return null;
        }

        // get salts with api.wordpress.org
        const salts = await this.getSalts();

        // read wp-config-sample.php file
        this.wpConfig = fs.readFileSync(this.wpConfigSample, 'utf8');

        // prepare values for lando config
        this.wpConfig = this.findReplaceWPConfigFile('DB_NAME', 'database_name_here', 'wordpress');
        this.wpConfig = this.findReplaceWPConfigFile('DB_USER', 'username_here', 'wordpress');
        this.wpConfig = this.findReplaceWPConfigFile('DB_PASSWORD', 'password_here', 'wordpress');
        this.wpConfig = this.findReplaceWPConfigFile('DB_HOST', 'localhost', 'database');
        this.wpConfig = this.findReplaceWPConfigFile('WP_DEBUG', 'false', 'true', true);

        // replace salts with api.wordpress.org
        salts ? this.replaceSalts(salts) : null;

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
    },

    // TODO - refactor find/replace and regex
    replaceSalts: function(salts) {
        const currentSalts = this.wpConfig.match(/(define)(.*)(here' \);)/g);

        if (currentSalts) {
            const newSalts = salts.data.split('\n');

            newSalts.forEach((salt, i) => {
                this.wpConfig = this.wpConfig.replace(currentSalts[i], salt);
            });
        }
    }
};
