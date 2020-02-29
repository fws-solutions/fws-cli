/**
 * Create PHP and SCSS Files
 *
 * @description CLI script for creating PHP template views.
 */

const fs = require('fs');
const path = require('path');
const _template = require('lodash.template');
const fancyLog = require('fancy-log');
const colors = require('ansi-colors');
const helpers = require('../helpers');

module.exports = {
    init: function (name, type, starter) {
        if (starter !== helpers.starterS) {
            helpers.consoleLogWarning('Something went wrong... this is NOT starter_s', 'red');
            return;
        }

        const part = `${type}s`;
        const directory = path.join(process.cwd(), 'template-views', part, name);

        // create if template or module doesn't exists
        if (!fs.existsSync(directory)) {
            fs.mkdirSync(directory);

            module.exports.createFile('php', name, type, directory);
            module.exports.createFile('php', name, type, directory, true);
            module.exports.createFile('scss', name, type, directory);
            module.exports.createFile('style', name, type, directory);

            module.exports.logCreatedFiles(name, type);
        } else {
            helpers.consoleLogWarning(`ERROR: ${type} '${name}' already exists`);
        }
    },

    createFile: function (file, name, type, directory, isFE = false) {
        const part = `${type}s`;
        let temp = `temp-${type}-php.txt`;
        let filename;

        // detect which file to create or update
        if (file === 'scss') {
            temp = `temp-${type}-scss.txt`;
            filename = `_${name}.scss`;
        } else if (file === 'php' && isFE) {
            temp = `temp-${type}-php-fe.txt`;
            filename = `_fe-${name}.php`;
        } else if (file === 'php') {
            filename = `${name}.php`;
        }

        const styleSRC = path.join(process.cwd(), 'src/scss/layout', `_${part}.scss`);
        const readDir = file === 'style' ? styleSRC : path.join(helpers.moduleDir, 'templates', temp);
        const writeDir = file === 'style' ? styleSRC : path.join(directory, filename);
        let output = fs.readFileSync(readDir, 'utf8');

        if (file === 'style') {
            output = output + `\n@import '../../../template-views/${part}/${name}/${name}';`;
        } else {
            const compiledFileContentTemp = _template(output);
            output = compiledFileContentTemp({
                str: name
            });
        }

        fs.writeFileSync(writeDir, output);
    },

    logCreatedFiles: function (name, type) {
        const tempLogFile = path.join(helpers.moduleDir, 'templates', `temp-${type}-log.txt`);
        const tempLog = fs.readFileSync(tempLogFile, 'utf8');
        const compiled = _template(tempLog);
        fancyLog(colors.green(compiled({str: name})));
    }
};
