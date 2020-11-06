/**
 * Create Lando File
 *
 * @description CLI script for creating Lando recipe file.
 */
const fs = require('fs');
const path = require('path');
const helpers = require('../helpers');
const store = require('../store');

module.exports = {
    projectName: '',
    themeName: '',
    hostName: '',
    landoConfigDir: path.join(process.cwd(), '/.lando.yml'),

    init: function(landoConfigDir) {
        this.landoConfigDir = landoConfigDir;
        this.projectName = store.getters.getProjectName();
        this.themeName = store.getters.getWpThemeName();
        this.hostName = helpers.createLandoHostName(this.projectName);

        return this.createLandoConfigFile();
    },

    createLandoConfigFile: function() {
        // exit if .lando.yml already exists
        if (fs.existsSync(this.landoConfigDir)) {
            return null;
        }

        // compile template
        const data = {
            projectName: this.projectName,
            themeName: this.themeName,
            hostName: this.hostName
        };
        const tempFile = 'temp-lando.txt';
        const compiledTemplate = helpers.compileTemplate(tempFile, data);

        // create file
        fs.writeFileSync(this.landoConfigDir, compiledTemplate, 'utf8');

        return this.hostName;
    }
};
