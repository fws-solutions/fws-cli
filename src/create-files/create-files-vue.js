/**
 * Create Vue File
 *
 * @description CLI script for creating Vue components.
 */

const fs = require('fs');
const path = require('path');
const _startCase = require('lodash.startcase');
const helpers = require('../helpers');
const store = require('../store');

module.exports = {
    name: '',
    type: '',
    starter: '',
    projectRoot: '',
    wpThemeDir: '',
    isPart: null,
    directoryFile: '',
    directoryStory: '',
    fileName: '',
    prettyName: '',
    prettyNamePrefix: '',
    compImportSrc: '',
    msg: '',
    msgPrefix: '',

    init: function(name, type) {
        // set global values
        this.name = name;
        this.type = type;
        this.starter = store.getters.getStarter();
        this.wpThemeDir = path.join(store.getters.getWpThemePath(), store.getters.getWpThemeName());
        this.projectRoot = store.getters.getProjectRoot();

        this.setFileDetails();
        this.checkIfComponentExists();
    },

    setFileDetails: function() {
        this.isPart = this.type === 'part';

        // names and strings
        this.fileName = _startCase(this.type) + _startCase(this.name).replace(/ /g, '');
        this.prettyName = _startCase(this.name);
        this.prettyNamePrefix = this.isPart ? 'Part: ' : 'Block: ';
        this.compImportSrc = `../components/${this.type}s/${this.fileName}`;

        // directories
        let vueCompDir;
        let vueStoryDir;
        switch (this.starter) {
            case helpers.starterS:
                vueCompDir = path.join(this.wpThemeDir, 'src/vue/components');
                vueStoryDir = '';
                break;
            case helpers.starterNuxt:
                vueCompDir = path.join(this.projectRoot, 'components');
                vueStoryDir = path.join(this.projectRoot, 'stories');
                break;
            case helpers.starterVue:
                vueCompDir = path.join(this.projectRoot, 'src/components');
                vueStoryDir = path.join(this.projectRoot, 'src/stories');
                break;
        }

        this.directoryFile = path.join(vueCompDir, `${this.type}s`, `${this.fileName}.vue`);
        this.directoryStory = path.join(vueStoryDir, `${this.isPart ? '2-' : '3-'}${this.fileName}.stories.js`);

        // success message
        this.msgPrefix = this.starter !== helpers.starterS ? 'Vue ' : '';
        this.msg = `New ${this.msgPrefix}component ${this.type} "${this.fileName}.vue" is created!`;
    },

    checkIfComponentExists: function() {
        // check if component already exists
        if (!fs.existsSync(this.directoryFile)) {
            this.generateVueFile();

            if (this.starter !== helpers.starterS) {
                this.generateVueStory();
                this.msg += `\n    New story     ${this.type} "${this.isPart ? '2-' : '3-'}${this.fileName}.stories.js" is created!`;
            }

            helpers.consoleLogWarning(this.msg, 'cyan');
        } else {
            helpers.consoleLogWarning(`WARNING: ${this.msgPrefix}Component ${this.type}: '${this.fileName}' already exists`);
        }
    },

    generateVueFile: function() {
        const data = {
            componentName: this.fileName,
            componentClass: this.name
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
