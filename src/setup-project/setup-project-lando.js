/**
 * Create Lando File
 *
 * @description CLI script for creating Lando recipe file.
 */
const fs = require('fs');
const path = require('path');
const helpers = require('../helpers');

module.exports = {
    projectName: '',
    themeName: '',
    landoConfigDir: path.join(process.cwd(), '/.lando.yml'),

    init: function(projectName, themeName) {
        this.projectName = projectName;
        this.themeName = themeName;
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
            themeName: this.themeName
        };
        const tempFile = 'temp-lando.txt';
        const compiledTemplate = helpers.compileTemplate(tempFile, data);

        // create file
        fs.writeFileSync(this.landoConfigDir, compiledTemplate, 'utf8');

        return true;
    }
};