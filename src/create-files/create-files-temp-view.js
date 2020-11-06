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
const store = require('../store');

module.exports = {
    name: '',
    type: '',
    starter: '',

    init: function(name, type) {
        // set global values
        this.name = name;
        this.type = type;
        this.starter = store.getters.getStarter();

        // exit if unknown starter
        if (this.starter !== helpers.starterS && this.starter !== helpers.starterTwig) {
            helpers.consoleLogWarning('Something went wrong... this is NOT fws_starter_s or fws_starter_twig', 'red');
            return;
        }

        const part = `${this.type}s`;
        const directory = this.createDirectoryPath(part);

        // create if template or module doesn't exists
        this.createDirectory(directory, this.createFiles.bind(this, directory));
    },

    createFiles: function(directory) {
        if (this.starter === helpers.starterS) {
            this.createFile('php', directory);
            this.createFile('php', directory, true);
        } else {
            this.createFile('twig', directory);
            this.createFile('json', directory);
        }

        this.createFile('scss', directory);
        this.createFile('style', directory);

        this.logCreatedFiles();
    },

    createFile: function(file, directory, isFE = false) {
        // set which files to create
        const part = `${this.type}s`;
        const config = this.filesToCreate(file, isFE);

        // set read/write directories
        const styleSRC = this.createStylePath(part);
        const readDir = file === 'style' ? styleSRC : path.join(helpers.moduleDir, 'templates', config.temp);
        const writeDir = file === 'style' ? styleSRC : path.join(directory, config.filename);

        // set output for writing
        let output = fs.readFileSync(readDir, 'utf8');

        if (file === 'style') {
            const src = this.starter === helpers.starterS ? 'template-views' : 'components';
            output = output + `\n@import '../../../${src}/${part}/${this.name}/${this.name}';`;
        } else {
            const compiledFileContentTemp = _template(output);
            output = compiledFileContentTemp({
                str: this.name
            });
        }

        // create file
        fs.writeFileSync(writeDir, output, 'utf8');
    },

    logCreatedFiles: function() {
        const temp = this.starter === helpers.starterS ? `temp-${this.type}-log.txt` : `temp-${this.type}-twig-log.txt`;
        const src = this.starter === helpers.starterS ? `template-views/${this.type}s` : `src/components/${this.type}s`;

        const tempLogFile = path.join(helpers.moduleDir, 'templates', temp);
        const tempLog = fs.readFileSync(tempLogFile, 'utf8');
        const compiled = _template(tempLog);
        fancyLog(colors.green(compiled({
            str: this.name,
            src: src
        })));
    },

    filesToCreate: function(file, isFE) {
        // file prefix and suffix for scss and fe files
        let prefix = file === 'scss' ? '_' : '';
        prefix = file === 'php' && isFE ? '_fe-' : prefix;
        const suffix = file === 'php' && isFE ? '-fe' : '';

        // create file name
        const temp = `temp-${this.type}-${file + suffix}.txt`;
        const filename = `${prefix + this.name}.${file}`;

        return {
            temp,
            filename
        };
    },

    createStylePath: function(part) {
        const src = this.starter === helpers.starterS ? 'src/scss/layout' : 'src/assets/scss/layout';
        return path.join(process.cwd(), src, `_${part}.scss`);
    },

    createDirectoryPath: function(part) {
        const src = this.starter === helpers.starterS ? 'template-views' : 'src/components';
        return path.join(process.cwd(), src, part, this.name);
    },

    createDirectory: function(directory, callback) {
        if (!fs.existsSync(directory)) {
            fs.mkdirSync(directory);
            callback();
        } else {
            helpers.consoleLogWarning(`ERROR: ${this.type} '${this.name}' already exists`);
        }
    }
};
