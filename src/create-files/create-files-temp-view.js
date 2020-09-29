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
    init: function(name, type, starter) {
        if (starter !== helpers.starterS && starter !== helpers.starterTwig) {
            helpers.consoleLogWarning('Something went wrong... this is NOT fws_starter_s or fws_starter_twig', 'red');
            return;
        }

        const part = `${type}s`;
        const directory = module.exports.createDirectoryPath(starter, part, name);

        // create if template or module doesn't exists
        module.exports.createDirectory(directory, type, name, module.exports.createFiles.bind(null, starter, directory, name, type));
    },

    createFiles: function(starter, directory, name, type) {
        if (starter === helpers.starterS) {
            module.exports.createFile('php', starter, name, type, directory);
            module.exports.createFile('php', starter, name, type, directory, true);
        } else {
            module.exports.createFile('twig', starter, name, type, directory);
            module.exports.createFile('json', starter, name, type, directory);
        }

        module.exports.createFile('scss', starter, name, type, directory);
        module.exports.createFile('style', starter, name, type, directory);

        module.exports.logCreatedFiles(starter, name, type);
    },

    createFile: function(file, starter, name, type, directory, isFE = false) {
        // set which files to create
        const part = `${type}s`;
        const config = module.exports.filesToCreate(file, name, type, isFE);

        // set read/write directories
        const styleSRC = module.exports.createStylePath(starter, part);
        const readDir = file === 'style' ? styleSRC : path.join(helpers.moduleDir, 'templates', config.temp);
        const writeDir = file === 'style' ? styleSRC : path.join(directory, config.filename);

        // set output for writing
        let output = fs.readFileSync(readDir, 'utf8');

        if (file === 'style') {
            const src = starter === helpers.starterS ? 'template-views' : 'components';
            output = output + `\n@import '../../../${src}/${part}/${name}/${name}';`;
        } else {
            const compiledFileContentTemp = _template(output);
            output = compiledFileContentTemp({
                str: name
            });
        }

        // create file
        fs.writeFileSync(writeDir, output);
    },

    logCreatedFiles: function(starter, name, type) {
        const temp = starter === helpers.starterS ? `temp-${type}-log.txt` : `temp-${type}-twig-log.txt`;
        const src = starter === helpers.starterS ? `template-views/${type}s` : `src/components/${type}s`;

        const tempLogFile = path.join(helpers.moduleDir, 'templates', temp);
        const tempLog = fs.readFileSync(tempLogFile, 'utf8');
        const compiled = _template(tempLog);
        fancyLog(colors.green(compiled({
            str: name,
            src: src
        })));
    },

    filesToCreate: function(file, name, type, isFE) {
        // file prefix and suffix for scss and fe files
        let prefix = file === 'scss' ? '_' : '';
        prefix = file === 'php' && isFE ? '_fe-' : prefix;
        const suffix = file === 'php' && isFE ? '-fe' : '';

        // create file name
        const temp = `temp-${type}-${file + suffix}.txt`;
        const filename = `${prefix + name}.${file}`;

        return {
            temp,
            filename
        };
    },

    createStylePath: function(starter, part) {
        const src = starter === helpers.starterS ? 'src/scss/layout' : 'src/assets/scss/layout';
        return path.join(process.cwd(), src, `_${part}.scss`);
    },

    createDirectoryPath: function(starter, part, name) {
        const src = starter === helpers.starterS ? 'template-views' : 'src/components';
        return path.join(process.cwd(), src, part, name);
    },

    createDirectory: function(directory, type, name, callback) {
        if (!fs.existsSync(directory)) {
            fs.mkdirSync(directory);
            callback();
        } else {
            helpers.consoleLogWarning(`ERROR: ${type} '${name}' already exists`);
        }
    }
};
