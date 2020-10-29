/**
 * Create Lando File
 *
 * @description CLI script for creating Lando recipe file.
 */
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const colors = require('ansi-colors');
const spinner = require('cli-spinner').Spinner;
const helpers = require('../helpers');

module.exports = {
    spawnConfig: {},
    spinner: null,
    timeout: 1500,

    init: function() {
        this.spinner = new spinner();
        this.spinner.setSpinnerString('|/-\\');

        this.spawnConfig = {
            stdio: 'inherit',
            cwd: process.cwd()
        }

        this.landoStart();
    },

    landoStart: function() {
        const _this = this;

        this.spinner.setSpinnerTitle(colors.cyan('%s ...getting ready for \'lando start\'...'));
        console.log('\n');
        this.spinner.start();

        setTimeout(() => {
            this.spinner.stop();
            console.log('\n');

            const startLando = spawn('lando', ['start'], this.spawnConfig);

            startLando.on('close', (code) => {

                //TODO: wp core install...
                process.exit(code);
                //_this.wpCoreInstall();
            });
        }, this.timeout);
    },

    wpCoreInstall: function() {
        const coreInstall = spawn('lando', ['wp', 'core', 'install'], this.spawnConfig);

        coreInstall.on('close', (code) => {
            console.log(`child process exited with code ${code}`);
            process.exit(code);
        });
    }
};
