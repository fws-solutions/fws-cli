import CommandDefinition from "../base/domain/Command/CommandDefinition.js";
import BaseCommand from "../base/domain/Command/BaseCommand.js";
import {resolve} from "path";
import fs from "fs";
import _startCase from "lodash.startcase";
import OptionDefinition from "../base/domain/Parameter/OptionDefinition.js";
import ArgumentDefinition from "../base/domain/Parameter/ArgumentDefinition.js";

export default class CreateFiles extends BaseCommand {
    _fileName;
    _filePath;
    _rollBackStash = {
        files: [],
        directories: []
    };
    constructor() {
        super(
            new CommandDefinition('create-file', 'create component files')
                .setMandatoryParameters(
                    new ParameterDefinition('name'),
                    new ParameterDefinition('type').setAvailableValues(['block', 'listing', 'part', 'block-vue', 'part-vue'])
                )
                .setAlias('cf')
                // .setMandatoryParameters(
                //     new ArgumentDefinition('name').setDescription('neki diskripshn').setAvailableValues(['nejmuan', 'something']),
                //     new OptionDefinition('n', 'some-name').setDescription('deskripcion'),
                // )
                // .setOptionalParameters(
                //     new ArgumentDefinition('opshnl-parametr').setDescription('neki adr diskripshn').setAvailableValues(['block', 'listing', 'part', 'block-vue', 'part-vue']),
                //     new ArgumentDefinition('opshnl2-parametr').setDescription('neki adr diskripshn').setAvailableValues(['block', 'listing', 'part', 'block-vue', 'part-vue']),
                //     new OptionDefinition('b', 'block').isFlag(),
                //     new OptionDefinition('l', 'listing').isFlag(),
                //     new OptionDefinition('p', 'part').isFlag(),
                //     new OptionDefinition('bv', 'block-vue').isFlag(),
                //     new OptionDefinition('pv', 'part-vue').isFlag()
                // )
                // .setAlias('cf')
        );
    }

    run() {
        // console.log(this.getParameter('name'));
        // console.log(this.getParameter('opshnl-parametr'));
        // console.log(this.getParameter('opshnl2-parametr'));
        // console.log(this.getParameter('block'));
        // console.log(this.getParameter('listing'));
        // console.log(this.getParameter('part'));
        // console.log(this.getParameter('block-vue'));
        // console.log(this.getParameter('part-vue'));
        // return;

        try {
            if (this.getParameter('type') === 'block' || this.getParameter('type') === 'listing' || this.getParameter('type') === 'part') {
                this.validateCorrectPackage(this.isWPPackage());
                const directoryPath = this._getDirectoryPath();
                this
                    ._validateDirectory(directoryPath)
                    ._createDirectory(directoryPath)
                    ._createFile('php', '', 'php', directoryPath)
                    ._createFile('php-fe', '_fe-', 'php', directoryPath)
                    ._createFile('scss', '', 'scss', directoryPath)
                    ._updateScssFile();
                    // when adding any new method below, modify rollBack for updateScssFile method
            } else if (this.getParameter('type') === 'block-vue' || this.getParameter('type') === 'part-vue') {
                this.validateCorrectPackage(this.isWPPackage() || this.isVuePackage() || this.isNuxtPackage())
                    ._checkVueComponentExists()
                    ._generateVueFile()
                    ._generateVueStory();
            }
        } catch (exception) {
            this._rollBack();
        }
    }

    _getDirectoryNameByType() {
        switch (true) {
            case this.getParameter('block') :
            case this.getParameter('block-vue'):
                return 'block';
            case this.getParameter('listing') :
                return 'listing';
            case this.getParameter('part') :
            case this.getParameter('part-vue'):
                return 'part';
        }
    }

    _checkVueComponentExists() {
        let vueComponentDir;

        if (this.isWPPackage()) vueComponentDir = resolve(this.package.getProjectRoot(), 'src/vue/components');
        else if (this.isNuxtPackage()) vueComponentDir = resolve(this.package.getProjectRoot(), 'components');
        else if (this.isVuePackage()) vueComponentDir = resolve(this.package.getProjectRoot(), 'src/components');

        this._fileName = (_startCase(this._getDirectoryNameByType()) + _startCase(this.getParameter('file-name'))).replace(/[\s]+/g, '');
        this._filePath = resolve(this.package.getProjectRoot(), vueComponentDir + `/${this._getDirectoryNameByType()}s`, `${this._fileName}.vue`);

        if (fs.existsSync(this._filePath)) {
            this.consoleLogWarning(`WARNING: Component '${this._fileName}' already exists!`);
            this.showEndMessage();
        }
        return this;
    }

    _generateVueFile() {
        let templateFile;

        if (this.isWPPackage()) templateFile = 'temp-vue-component.txt';
        else if (this.isNuxtPackage()) templateFile = 'temp-vue-component.txt';
        else if (this.isVuePackage()) templateFile = 'temp-vuets-component.txt';

        const data = {
            componentName: this._fileName,
            componentClass: this.getParameter('file-name')
        };

        const compiledTemplate =this.compileTemplate(templateFile, data);
        try {
            fs.writeFileSync(this._filePath, compiledTemplate, 'utf8');
            this._rollBackStash.files.push(this._filePath);
        } catch (exception) {
            throw exception;
        }
        this.inlineLogSuccess(`New component "${this._fileName}.vue" is created!`);
        return this;
    }

    _generateVueStory() {
        let templateFile;
        let writeFile;

        if (this.isWPPackage()) return this;
        if (this.isNuxtPackage()){
            templateFile = 'temp-vue-story.txt';
            writeFile = resolve(this.package.getProjectRoot(), 'stories');
        } else if (this.isVuePackage()) {
            templateFile = 'temp-vuets-story.txt';
            writeFile = resolve(this.package.getProjectRoot(), 'src/stories');
        }

        const prefix = _startCase(this.getParameter('type')) === 'Part'? '2-' : '3-';
        const filePath = resolve(this.package.getProjectRoot(), writeFile + `/${prefix + this._fileName}.stories.js`);

        const data = {
            componentSrc: `../components/${this.getParameter('type')}s/${this._fileName}`,
            componentName: this._fileName,
            componentPrettyName: _startCase(this.getParameter('file-name')),
            componentPrettyNamePrefix: _startCase(this.getParameter('type')) + ': ',
            componentWrapFluid: true
        };

        const compiledTemplate = this.compileTemplate(templateFile, data);
        try {
            fs.writeFileSync(filePath, compiledTemplate, 'utf8');
            this._rollBackStash.files.push(filePath);
        } catch (exception) {
            throw exception;
        }
        this.inlineLogSuccess(`New story ${this.getParameter('type')} "${prefix}${this._fileName}.stories.js" is created!`);
        return this;
    }

    _createFile(tempName, prefix, extension, directoryPath) {
        const template = `temp-${this.getParameter('type')}-${tempName}.txt`;
        const directory = 'template-views';

        const directoryName = this._getDirectoryName();
        const fileName = `${prefix + directoryName}.${extension}`;
        const writeDir = resolve(directoryPath, fileName);

        const data = {
            str: directoryName,
        }
        const output = this.compileTemplate(template, data);

        try {
            fs.writeFileSync(writeDir, output, 'utf8');
            this._rollBackStash.files.push(writeDir);
        } catch (exception) {
            throw exception;
        }
        this.inlineLogSuccess(`Created ${extension.toUpperCase()} file: '${fileName}' in dir '${directory}/${this.getParameter('type')}s/${directoryName}'`);
        return this;
    }


    _updateScssFile() {
        let output = '';
        const directoryPath = 'src/scss/layout';
        const directory = 'template-views';

        const generateFile = `_${this.getParameter('type')}s.scss`;
        const fileName = this._getDirectoryName();
        const file = resolve(this.package.getProjectRoot(), directoryPath, generateFile);

        if (fs.existsSync(file)) output = fs.readFileSync(file, 'utf8');

        output = output.replace(/^(?=\n)$|^\s*|\s*$|\n\n+/gm, "");
        output += `\n@import '../../../${directory}/${this.getParameter('type')}s/${fileName}/${fileName}';`;

        try {
            fs.writeFileSync(file, output, 'utf8');
        } catch (exception) {
            throw exception;
        }
        this.inlineLogSuccess(`Updated SCSS file: '${generateFile}' in dir '${directoryPath}'`)
        return this;
    }

    _getDirectoryPath() {
        const directory = 'template-views';
        return resolve(this.package.getProjectRoot(), directory + '/' + this.getParameter('type') + 's/' + this._getDirectoryName());
    }

    _validateDirectory(directoryPath) {
        if (fs.existsSync(directoryPath)) {
            this.consoleLogWarning(`ERROR: ${this.getParameter('type')} '${_startCase(this.getParameter('file-name')).replace(/[\s]+/g, '-').toLowerCase()}' already exists!`);
            this.showEndMessage();
        }
        return this;
    }

    _createDirectory(directory) {
        try {
            fs.mkdirSync(directory);
            this._rollBackStash.directories.push(directory);
        } catch (exception) {
            throw exception;
        }
        return this;
    }

    _getDirectoryName() {
        return _startCase(this.getParameter('file-name')).replace(/[\s]+/g, '-').toLowerCase();
    }

    _rollBack() {
        this.consoleLogWarning(`Something went wrong...`);
        this._rollBackStash.files.forEach((file)=>{
            fs.unlinkSync(file);
            this.inlineLogWarning(`Deleted ${file} file!`);
        })
        this._rollBackStash.directories.forEach((directory)=>{
            fs.rmdirSync(directory);
            this.inlineLogWarning(`Deleted ${directory} directory!`);
        })
    }
}
