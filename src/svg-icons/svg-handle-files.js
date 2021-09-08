/**
 * SVG Handle Files
 *
 * @description Helper functions for handling SVG files.
 */

const fs = require('fs');
const path = require('path');
const fancyLog = require('fancy-log');
const colors = require('ansi-colors');
const helpers = require('../helpers');
const SVGO = require('svgo');
const svgPlugins = require('./svg-plugins');

module.exports = {
    renameSvgFiles: function(file, filePath, allFiles, svgDirPath) {
        return new Promise((resolve) => {
            helpers.rf(filePath, () => {
                let newFile;

                if (file.substring(0, 4) !== 'ico-') {
                    newFile = file.toLowerCase();
                    newFile = newFile.toLowerCase();
                    newFile = newFile.replace('.svg', '').replace(/-/g, ' ').replace(/[^\w\s]/gi, '').replace(/ /g, '-');
                    newFile = `ico-${newFile}.svg`;

                    if (allFiles.includes(newFile)) {
                        // delete file if already exists
                        try {
                            fs.unlinkSync(filePath);
                            helpers.consoleLogWarning(`deleted '${filePath}' as file with same name already exists`, 'red');
                        } catch (err) {
                            fancyLog(colors.red(err));
                        }
                    } else {
                        // rename file
                        fs.renameSync(filePath, path.join(svgDirPath, newFile));
                    }
                } else {
                    newFile = file;
                }

                resolve(newFile);
            });
        });
    },

    optimizeSvgFiles: function(filePath) {
        return new Promise((resolve) => {
            helpers.rf(filePath, (data) => {
                resolve(SVGO.optimize(data, {
                    path: filePath,
                    plugins: svgPlugins
                }));
            });
        });
    },

    saveSvgFiles: function(filepath, data) {
        return new Promise((resolve) => {
            fs.writeFile(filepath, data, err => {
                if (err) throw err;
                resolve(filepath);
            });
        });
    }
};
