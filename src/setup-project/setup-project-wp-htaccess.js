/**
 * Create .htaccess File
 *
 * @description CLI script for creating .htaccess file in wp-content/uploads directory.
 */
const fs = require('fs');
const path = require('path');
const helpers = require('../helpers');

module.exports = {
    hostName: '',
    devName: '',
    htaccessDir: path.join(process.cwd(), '/wp-content/uploads/.htaccess'),

    init: function(hostName, devName) {
        this.hostName = hostName;
        this.devName = devName;

        return this.createHtaccessFile();
    },

    createHtaccessFile: function() {
        // exit if .htaccess already exists
        if (fs.existsSync(this.htaccessDir)) {
            return null;
        }

        // compile template
        const data = {
            hostName: this.hostName,
            devName: this.devName
        };
        const tempFile = 'temp-htaccess.txt';
        const compiledTemplate = helpers.compileTemplate(tempFile, data);

        // create file
        fs.writeFileSync(this.htaccessDir, compiledTemplate, 'utf8');

        return true;
    }
};
