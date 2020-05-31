/**
 * Post Install
 *
 * @description Post install script after 'npm install'.
 */
const fs = require('fs');
const path = require('path');
const helpers = require('../helpers');

module.exports = {
    directoryFile: path.join(process.cwd(), '/.env'),

    init: function() {
        this.createEnv();
    },

    createEnv: function() {
        // check if file already exists
        if (!fs.existsSync(this.directoryFile)) {
            fs.writeFileSync(this.directoryFile, 'ADMIN_URL=http://admin.some-site.local/', 'utf8');
            helpers.consoleLogWarning('Generated .env file in the root of the Nuxt project! \n    Please configure your local environment.', 'cyan');
        } else {
            helpers.consoleLogWarning('WARNING: .env already exists');
        }
    },
};
