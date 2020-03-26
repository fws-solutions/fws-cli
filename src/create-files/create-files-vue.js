/**
 * Create Vue File
 *
 * @description CLI script for creating Vue components.
 */

const fs = require('fs');
const path = require('path');
const _startCase = require('lodash.startcase');
const _template = require('lodash.template');
const helpers = require('../helpers');

module.exports = {
    init: function(name, type, starter) {
        const isStarterNuxt = starter === helpers.starterNuxt;
        const isPart = type === 'part';
        const vueCompDir = isStarterNuxt ? 'components' : 'src/vue/components';

        // names and strings
        const fileName = _startCase(type) + _startCase(name).replace(/ /g, '');
        const prettyName = _startCase(name);
        const prettyNamePrefix = isPart ? 'Part: ' : 'Block: ';
        const compImportSrc = `../components/${type}s/${fileName}`;

        // directories
        const directory = path.join(process.cwd(), vueCompDir, `${type}s`, `${fileName}.vue`);
        const directoryStory = path.join(process.cwd(), 'stories', `${isPart ? '2-' : '3-'}${fileName}.stories.js`);

        // success message
        const msgPrefix = isStarterNuxt ? '' : 'Vue ';
        let msg = `New ${msgPrefix}component ${type} "${fileName}.vue" is created!`;

        // check if component already exists
        if (!fs.existsSync(directory)) {
            this.generateVueFile(name, fileName, directory);

            if (isStarterNuxt) {
                this.generateVueStory(isPart, prettyNamePrefix, prettyName, compImportSrc, fileName, directoryStory);
                msg += `\n    New story     ${type} "${isPart ? '2-' : '3-'}${fileName}.stories.js" is created!`;
            }

            helpers.consoleLogWarning(msg, 'cyan');
        } else {
            helpers.consoleLogWarning(`WARNING: ${msgPrefix}Component ${type}: '${fileName}' already exists`);
        }
    },

    compileTemplate: function(templateFile, data) {
        // get template file
        const tempSrc = path.join(helpers.moduleDir, 'templates', templateFile);
        const tempFile = fs.readFileSync(tempSrc, 'utf8');
        // set compiler
        const templateCompiler = _template(tempFile);

        // return compiled data
        return templateCompiler(data);
    },

    generateVueFile: function(name, fileName, directory) {
        const data = {
            componentName: fileName,
            componentClass: name
        };
        const compiledTemplate = this.compileTemplate('temp-vue-component.txt', data);

        // generate new Vue file
        fs.writeFileSync(directory, compiledTemplate, 'utf8');
    },

    generateVueStory: function(wrapFluid, prettyNamePrefix, prettyName, compImportSrc, fileName, directory) {
        const data = {
            componentSrc: compImportSrc,
            componentName: fileName,
            componentPrettyName: prettyName,
            componentPrettyNamePrefix: prettyNamePrefix,
            componentWrapFluid: wrapFluid
        };
        const compiledTemplate = this.compileTemplate('temp-vue-story.txt', data);

        // generate new Vue file
        fs.writeFileSync(directory, compiledTemplate, 'utf8');
    }
};
