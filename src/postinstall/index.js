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
    directoryExampleEnvFile: path.join(process.cwd(), '/.env.example'),
    moduleExampleEnvFileNuxt: path.join(__dirname, '/example-nuxt.env'),
    moduleExampleEnvFileS: path.join(__dirname, '/example-s.env'),

    init: function(starter) {
        const isNuxtStarter = starter === 'fws_starter_nuxt';
        this.createEnv(isNuxtStarter);
    },

    createEnv: function(isNuxtStarter) {
        const exampleEnvFile = isNuxtStarter ? this.moduleExampleEnvFileNuxt : this.moduleExampleEnvFileS;

        // Create example.env file in project root if it doesn't exist
        if (!fs.existsSync(this.directoryExampleEnvFile)) {
            fs.copyFileSync(exampleEnvFile, this.directoryExampleEnvFile);
            helpers.consoleLogWarning(`Generated .env.example file in the root of the ${isNuxtStarter ? 'Nuxt project' : 'theme directory'}!`, 'cyan');
        } else {
            helpers.consoleLogWarning('WARNING: .env.example already exists');
        }

        // Create .env file in project root if it doesn't exist
        if (!fs.existsSync(this.directoryEnvFile)) {
            fs.copyFileSync(this.directoryExampleEnvFile, this.directoryEnvFile);
            helpers.consoleLogWarning(`Generated .env file in the root of the ${isNuxtStarter ? 'Nuxt project' : 'theme directory'}! \n    Please configure your local environment.`, 'cyan');
        } else {
            helpers.consoleLogWarning('WARNING: .env already exists');
        }
    },
};
