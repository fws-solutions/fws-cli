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
    projectThemeName: '',

    init: function() {
        this.wpConfigSample = helpers.getWPConfigSample();

        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        this.setProjectName();
        this.processValues();
    },

    setProjectName: function() {
        const _this = this;
        const question = colors['cyan']('Please enter the project\'s name: ');

        this.rl.question(question, name => {
            _this.projectName = name.trim();
            _this.setProjectThemeName();
        });
    },

    setProjectThemeName: function() {
        const _this = this;
        const question = colors['cyan']('Please enter the project\'s theme name: ');

        this.rl.question(question, name => {
            _this.projectThemeName = name.trim();
            _this.rl.close();
        });
    },

    processValues: function() {
        const _this = this;

        this.rl.on('close', function() {
            if (_this.invalidInputs()) {
                const msg = 'This command does not except naming with spaces.\n    Please do not use space characters.';
                helpers.consoleLogWarning(msg, 'red', true);
            }

            console.log(_this.projectName);
            console.log(_this.projectThemeName);
            process.exit(0);
        });
    },

    invalidInputs() {
        return this.projectName.indexOf(' ') > -1 || this.projectThemeName.indexOf(' ') > -1;
    }
};
