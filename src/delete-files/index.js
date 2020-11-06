/**
 * Delete File
 *
 * @description CLI script for deleting FE components.
 */
const fs = require('fs');
const path = require('path');
const colors = require('ansi-colors');
const helpers = require('../helpers');
const store = require('../store');
const glob = require('glob');

module.exports = {
    wpThemeDir: '',

    init: function() {
        this.wpThemeDir = path.join(store.getters.getWpThemePath(), store.getters.getWpThemeName());
        const tempViewPath = path.join(this.wpThemeDir, 'template-views/**/*.php');
        const allTempFiles = glob.sync(tempViewPath);
        this.deleteFeFiles(allTempFiles);
    },

    filterFeFiles: function(files) {
        return files.filter((file) => {
            const fileStat = fs.lstatSync(file);
            const fileName = path.basename(file);

            return !fileStat.isDirectory() && path.extname(file) === '.php' && fileName.substring(0, 4) === '_fe-';
        });
    },

    deleteFeFiles: function(files) {
        let count = 1;
        const filteredFiles = this.filterFeFiles(files);

        if (filteredFiles.length > 0) {
            helpers.consoleLogWarning('DELETED FE FILES:', 'red');

            filteredFiles.forEach((file) => {
                fs.unlinkSync(file);
                console.log(colors.red(`    ${count++}. ${path.relative(this.wpThemeDir, file)}`));
            });
        } else {
            helpers.consoleLogWarning('No FE files to delete');
        }
    }
};
