/**
 * Post Install
 *
 * @description Post install script after 'npm install'.
 */
const fs = require('fs');
const path = require('path');
const helpers = require('../helpers');

module.exports = {

    directoryEnvFile: path.join(process.cwd(), '/.env'),
    directoryExampleEnvFile: path.join(process.cwd(), '/example.env'),
    moduleExampleEnvFile: path.join(__dirname, '/example.env'),

    init: function() {
        this.createEnv();
    },

    createEnv: function() {

        // Create example.env file in project root if it doesn't exist
        if (!fs.existsSync(this.directoryExampleEnvFile)) {
            fs.copyFileSync(this.moduleExampleEnvFile, this.directoryExampleEnvFile);
        }

        // Create .env file in project root if it doesn't exist
        if (!fs.existsSync(this.directoryEnvFile)) {
            fs.copyFileSync(this.directoryExampleEnvFile, this.directoryEnvFile);
            helpers.consoleLogWarning('Generated .env file in the root of the Nuxt project! \n    Please configure your local environment.', 'cyan');
        } else {
            helpers.consoleLogWarning('WARNING: .env already exists');
        }
    },
};
