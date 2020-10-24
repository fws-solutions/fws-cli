/**
 * Create Lando File
 *
 * @description CLI script for creating Lando recipe file.
 */
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const colors = require('ansi-colors');
const readline = require('readline');
const helpers = require('../helpers');

module.exports = {
    rl: null,
    projectName: '',
    themeName: '',
    wpConfigSample: null,
    wpConfigDir: path.join(process.cwd(), '/wp-config.php'),
    wpConfig: null,
    landoConfigDir: path.join(process.cwd(), '/.lando.yml'),

    init: function(wpConfigSample) {
        this.wpConfigSample = wpConfigSample;

        // init inputs
        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        // set and create files
        this.setProjectName();
        this.createFiles();
    },

    setProjectName: function() {
        const _this = this;
        const question = colors['magenta']('Please enter the project\'s name: ');

        this.rl.question(question, name => {
            _this.projectName = name.trim();
            _this.setThemeName();
        });
    },

    setThemeName: function() {
        const _this = this;
        const question = colors['magenta']('Please enter the theme\'s name: ');

        this.rl.question(question, name => {
            _this.themeName = name.trim();
            _this.rl.close();
        });
    },

    createFiles: function() {
        const _this = this;

        // submit entered values
        this.rl.on('close', function() {
            if (_this.invalidInputs()) {
                const msg = 'This command does not except naming with spaces.\n    Please do not use space characters.';
                helpers.consoleLogWarning(msg, 'red', true);
            }

            _this.createLandoConfigFile();
            _this.createWPConfigFile();
        });
    },

    createWPConfigFile: async function() {
        // exit if wp-config already exists
        if (fs.existsSync(this.wpConfigDir)) {
            helpers.consoleLogWarning('WARNING: wp-config.php file already exists!');
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
        helpers.consoleLogWarning('wp-config.php file is created!', 'green');
        process.exit(0);
    },

    createLandoConfigFile: function() {
        // exit if .lando.yml already exists
        if (fs.existsSync(this.landoConfigDir)) {
            helpers.consoleLogWarning('WARNING: .lando.yml file already exists!');
            return null;
        }

        // compile template
        const data = {
            projectName: this.projectName,
            themeName: this.themeName
        };
        const tempFile = 'temp-lando.txt';
        const compiledTemplate = helpers.compileTemplate(tempFile, data);

        // create file
        fs.writeFileSync(this.landoConfigDir, compiledTemplate, 'utf8');
        helpers.consoleLogWarning('.lando.yml file is created!', 'green');
    },

    findReplaceWPConfigFile: function(entry, oldVal, newVal, noQuote = false) {
        const oldDef = `define( '${entry}', ${this.noQuoteWrap(oldVal, noQuote)} );`;
        const newDef = `define( '${entry}', ${this.noQuoteWrap(newVal, noQuote)} );`;

        return this.wpConfig.replace(oldDef, newDef);
    },

    noQuoteWrap: function(word, noQuote) {
        return !noQuote ? `'${word}'` : word;
    },

    invalidInputs() {
        return this.projectName.indexOf(' ') > -1 || this.themeName.indexOf(' ') > -1;
    },

    getSalts: async function() {
        try {
            return await axios.get(`https://api.wordpress.org/secret-key/1.1/salt/`);
        } catch (error) {
            console.log(error);
            return '';
        }
    },

    // TODO - refactor find/replace and regex
    replaceSalts: function(salts) {
        const currentSalts = this.wpConfig.match(/(define)(.*)(here' \);)/g);
        const newSalts = salts.data.split('\n');

        newSalts.forEach((salt, i) => {
            this.wpConfig = this.wpConfig.replace(currentSalts[i], salt);
        });
    }
};
