import CommandDefinition from "../base/domain/Command/CommandDefinition.js";
import BaseCommand from "../base/domain/Command/BaseCommand.js";
import {resolve} from "path";
import _startCase from "lodash.startcase";
import fs from "fs";

export default class CreateFiles extends BaseCommand {
    _fileName;
    _filePath;
    constructor() {
        super(
            new CommandDefinition('create-file', 'create component files')
                .setMandatoryParameters('name', 'type')
        );
    }

    run(name, type) {
        this._name = name;
        this._type = type;
        this.showStartMessage();
        this._validateType();
        this._checkType();
    }

    _validateType() {
        const commandType = ['block', 'listing', 'part', 'block-vue', 'part-vue'];
        if (commandType.filter(element=> {return element === this._type}).length < 1) {
            this.consoleLogError(`Unknown type: ${this._type}!`);
            this.showEndMessage();
        }
    }

    _checkType() {
        if (this._type === 'block' || this._type === 'listing' || this._type === 'part') {

        } else if (this._type === 'block-vue' || this._type === 'part-vue') {
            this._type = (this._type).replace('-vue', '');
            this._checkVueComponentExists();
            this._generateVueFile();
            this._generateVueStory();
            this.showEndMessage();
        }
    }

    _checkVueComponentExists() {
        let vueComponentDir;

        if (this.isWPPackage()) vueComponentDir = resolve(this.package.getProjectRoot(), 'src/vue/components');
        else if (this.isNuxtPackage()) vueComponentDir = resolve(this.package.getProjectRoot(), 'components');
        else if (this.isVuePackage()) vueComponentDir = resolve(this.package.getProjectRoot(), 'src/components');
        else {
            this.consoleLogError('Unknown package type!');
            this.showEndMessage();
        }

        this._fileName = (_startCase(this._type) + _startCase(this._name)).replace(/[\s]+/g, '');
        this._filePath = resolve(this.package.getProjectRoot(), vueComponentDir + `/${this._type}s`, `${this._fileName}.vue`);

        if (fs.existsSync(this._filePath)) {
            this.consoleLogWarning(`WARNING: Component '${this._fileName}' already exists!`);
            this.showEndMessage();
        }
    }

    _generateVueFile() {
        let templateFile;

        if (this.isWPPackage()) templateFile = 'temp-vue-component.txt';
        else if (this.isNuxtPackage()) templateFile = 'temp-vue-component.txt';
        else if (this.isVuePackage()) templateFile = 'temp-vuets-component.txt';

        const data = {
            componentName: this._fileName,
            componentClass: this._name
        };

        const compiledTemplate =this.compileTemplate(templateFile, data);
        try {
            fs.writeFileSync(this._filePath, compiledTemplate, 'utf8');
            this.inlineLogSuccess(`New component "${this._fileName}.vue" is created!`);
        } catch (exception) {
            this.inlineLogError(exception);
            this.showEndMessage();
        }
    }

    _generateVueStory() {
        let templateFile;
        let writeFile;

        if (this.isWPPackage()) return;
        if (this.isNuxtPackage()){
            templateFile = 'temp-vue-story.txt';
            writeFile = resolve(this.package.getProjectRoot(), 'stories');
        } else if (this.isVuePackage()) {
            templateFile = 'temp-vuets-story.txt';
            writeFile = resolve(this.package.getProjectRoot(), 'src/stories');
        }

        const prefix = _startCase(this._type) === 'Part'? '2-' : '3-';
        const storyDirectory = resolve(this.package.getProjectRoot(), writeFile + `/${prefix + this._fileName}.stories.js`);

        const data = {
            componentSrc: `../components/${this._type}s/${this._fileName}`,
            componentName: this._fileName,
            componentPrettyName: _startCase(this._name),
            componentPrettyNamePrefix: _startCase(this._type) + ': ',
            componentWrapFluid: true
        };

        const compiledTemplate =this.compileTemplate(templateFile, data);
        try {
            fs.writeFileSync(storyDirectory, compiledTemplate, 'utf8');
            this.inlineLogSuccess(`New story ${this._type} "${prefix}${this._fileName}.stories.js" is created!`);
        } catch (exception) {
            this.inlineLogError(exception);
            this.showEndMessage();
        }
    }
}
