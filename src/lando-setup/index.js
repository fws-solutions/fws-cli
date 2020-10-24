/**
 * Create Lando File
 *
 * @description CLI script for creating Lando recipe file.
 */
const fs = require('fs');
const path = require('path');
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

        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

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

        this.rl.on('close', function() {
            if (_this.invalidInputs()) {
                const msg = 'This command does not except naming with spaces.\n    Please do not use space characters.';
                helpers.consoleLogWarning(msg, 'red', true);
            }

            _this.createWPConfigFile();
            _this.createLandoConfigFile();
            process.exit(0);
        });
    },

    createWPConfigFile: function() {
        if (fs.existsSync(this.wpConfigDir)) {
            helpers.consoleLogWarning('WARNING: wp-config.php file already exists!');
            return null;
        }

        this.wpConfig = fs.readFileSync(this.wpConfigSample, 'utf8');

        this.wpConfig = this.findReplaceWPConfigFile('DB_NAME', 'database_name_here', 'wordpress');
        this.wpConfig = this.findReplaceWPConfigFile('DB_USER', 'username_here', 'wordpress');
        this.wpConfig = this.findReplaceWPConfigFile('DB_PASSWORD', 'password_here', 'wordpress');
        this.wpConfig = this.findReplaceWPConfigFile('DB_HOST', 'localhost', 'database');
        this.wpConfig = this.findReplaceWPConfigFile('WP_DEBUG', 'false', 'true', true);

        fs.writeFileSync(this.wpConfigDir, this.wpConfig, 'utf8');

        helpers.consoleLogWarning('wp-config.php file is created!', 'green');
    },

    createLandoConfigFile: function() {
        if (fs.existsSync(this.landoConfigDir)) {
            helpers.consoleLogWarning('WARNING: .lando.yml file already exists!');
            return null;
        }

        const data = {
            projectName: this.projectName,
            themeName: this.themeName
        };
        const tempFile = 'temp-lando.txt';
        const compiledTemplate = helpers.compileTemplate(tempFile, data);

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
    }
};
