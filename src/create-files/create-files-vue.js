/**
 * Create Vue File
 *
 * @description CLI script for creating Vue components.
 */

const fs = require('fs');
const path = require('path');
const _startCase = require('lodash.startcase');
const helpers = require('../helpers');

module.exports = {
    isPart: null,
    starter: '',
    directoryFile: '',
    directoryStory: '',
    fileName: '',
    prettyName: '',
    prettyNamePrefix: '',
    compImportSrc: '',
    msg: '',
    msgPrefix: '',

    init: function(name, type, starter) {
        this.starter = starter;
        this.setFileDetails(name, type);
        this.checkIfComponentExists(name, type);
    },

    setFileDetails: function(name, type) {
        this.isPart = type === 'part';

        // names and strings
        this.fileName = _startCase(type) + _startCase(name).replace(/ /g, '');
        this.prettyName = _startCase(name);
        this.prettyNamePrefix = this.isPart ? 'Part: ' : 'Block: ';
        this.compImportSrc = `../components/${type}s/${this.fileName}`;

        // directories
        let vueCompDir;
        let vueStoryDir;
        switch (this.starter) {
            case helpers.starterS:
                vueCompDir = 'src/vue/components';
                vueStoryDir = '';
                break;
            case helpers.starterNuxt:
                vueCompDir = 'components';
                vueStoryDir = 'stories';
                break;
            case helpers.starterVue:
                vueCompDir = 'src/components';
                vueStoryDir = 'src/stories';
                break;
        }

        this.directoryFile = path.join(process.cwd(), vueCompDir, `${type}s`, `${this.fileName}.vue`);
        this.directoryStory = path.join(process.cwd(), vueStoryDir, `${this.isPart ? '2-' : '3-'}${this.fileName}.stories.js`);

        // success message
        this.msgPrefix = this.starter !== helpers.starterS ? 'Vue ' : '';
        this.msg = `New ${this.msgPrefix}component ${type} "${this.fileName}.vue" is created!`;
    },

    checkIfComponentExists: function(name, type) {
        // check if component already exists
        if (!fs.existsSync(this.directoryFile)) {
            this.generateVueFile(name);

            if (this.starter !== helpers.starterS) {
                this.generateVueStory();
                this.msg += `\n    New story     ${type} "${this.isPart ? '2-' : '3-'}${this.fileName}.stories.js" is created!`;
            }

            helpers.consoleLogWarning(this.msg, 'cyan');
        } else {
            helpers.consoleLogWarning(`WARNING: ${this.msgPrefix}Component ${type}: '${this.fileName}' already exists`);
        }
    },

    generateVueFile: function(name) {
        const data = {
            componentName: this.fileName,
            componentClass: name
        };
        const tempFile = this.starter !== helpers.starterVue ? 'temp-vue-component.txt' : 'temp-vuets-component.txt';
        const compiledTemplate = helpers.compileTemplate(tempFile, data);

        // generate new Vue file
        fs.writeFileSync(this.directoryFile, compiledTemplate, 'utf8');
    },

    generateVueStory: function() {
        const data = {
            componentSrc: this.compImportSrc,
            componentName: this.fileName,
            componentPrettyName: this.prettyName,
            componentPrettyNamePrefix: this.prettyNamePrefix,
            componentWrapFluid: this.isPart
        };
        const tempFile = this.starter !== helpers.starterVue ? 'temp-vue-story.txt' : 'temp-vuets-story.txt';
        const compiledTemplate = helpers.compileTemplate(tempFile, data);

        // generate new Vue file
        fs.writeFileSync(this.directoryStory, compiledTemplate, 'utf8');
    }
};
