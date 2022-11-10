import CommandDefinition from "./CommandDefinition.js";
import fancyLog from 'fancy-log';
import colors from 'ansi-colors';
import notifier from 'node-notifier';
import {readFileSync} from 'fs';
import _template from 'lodash.template';
import {resolve, dirname} from 'path';
import {fileURLToPath} from 'url';
import WordPressPackage from "../Package/WordPress/WordPressPackage.js";
import VuePackage from "../Package/WordPress/VuePackage.js";
import NuxtPackage from "../Package/WordPress/NuxtPackage.js";
import Spinner from 'cli-spinner';
import CliProgress from 'cli-progress';
import NextPackage from "../Package/WordPress/NextPackage.js";


export default class BaseCommand {
    _definition;
    _package;
    _spinner;
    _progressBar;

    constructor(definition) {
        if (!(definition instanceof CommandDefinition)) throw new Error('Missing command definition!')
        this._definition = definition;
        this._setPackage();
        this._setProgressBar();
    }

    hasParameter(name) {
        let hasParameter = false;
        this._definition.mandatoryParameters.forEach((parameter) => {
            if (parameter.name === name) hasParameter = true;
        });
        return hasParameter;
    }

    getParameter(name) {
        let value = undefined;
        this._definition.mandatoryParameters.forEach((parameter) => {
            if (parameter.name === name) value = parameter.value;
        });
        return value;
    }

    validateInputParameters() {
        this
            ._validateMandatoryParameters()
            ._validateOptionalParameters();
    }

    _validateMandatoryParameters() {
        this._definition.mandatoryParameters.forEach((parameter) => {
            if (parameter.hasAvailableValues() && parameter.availableValues.indexOf(parameter.value) < 0) {
                this.consoleLogError(`Value out of bounds for parameter ${parameter.name}!`);
                this.showEndMessage();
            }
        });
        return this;
    }

    _validateOptionalParameters() {
        this._definition.optionalParameters.forEach((parameter) => {
            if (parameter.hasAvailableValues() && parameter.hasValue() && parameter.availableValues.indexOf(parameter.value) < 0) {
                this.consoleLogError(`Value out of bounds for parameter ${parameter.name}!`);
                this.showEndMessage();
            }
        });
        return this;
    }

    validateCorrectPackage(condition) {
        if (!condition) {
            this.consoleLogError('Wrong package type!')
            this.showEndMessage();
        }
        return this;
    }

    getDefinition() {
        return this._definition;
    }

    getCurrentWorkingDirectory() {
        return process.cwd();
    }

    getApplicationRoot() {
        return resolve(dirname(fileURLToPath(import.meta.url)), '../../../');
    }

    getApplicationTemplateDirectory() {
        return resolve(this.getApplicationRoot(), 'base/templates');
    }

    getApplicationEnvDirectory() {
        return resolve(this.getApplicationRoot(), 'base/source/env');
    }

    // Logging and error handling

    inlineLogSuccess(message) {
        fancyLog(colors.cyan(message));
    }

    inlineLogWarning(message) {
        fancyLog(colors.yellow(message));
    }

    inlineLogError(message) {
        fancyLog(colors.red(message));
    }

    consoleLogSuccess(message) {
        this._consoleLogMessage(message, 'cyan');
    }

    consoleLogWarning(message) {
        this._consoleLogMessage(message, 'yellow');
    }

    consoleLogError(message) {
        this._consoleLogMessage(message, 'red');
    }

    _consoleLogMessage(message, color) {
        const template = readFileSync(resolve(this.getApplicationTemplateDirectory(), 'temp-cli-log.txt'), 'utf8');
        const compiled = _template(template);
        fancyLog(colors[color](compiled({message: message})));
    }

    notifyError(message) {
        notifier.notify({
            title: 'ERROR',
            icon: resolve(this.getApplicationRoot(), '/assets/error-icon.png'),
            message: message,
            time: 1000,
            type: 'error'
        });
    }

    _setPackage() {
        if (new WordPressPackage().is()) this._package = new WordPressPackage();
        else if (new VuePackage().is()) this._package = new VuePackage();
        else if (new NuxtPackage().is()) this._package = new NuxtPackage();
        else {
            this.consoleLogError('Unknown package type!');
            process.exit(1);
        }
    }

    get package() {
        return this._package;
    }

    isWPPackage() {
        return this._package instanceof WordPressPackage;
    }

    isNuxtPackage() {
        return this._package instanceof NuxtPackage;
    }

    isVuePackage() {
        return this._package instanceof VuePackage;
    }

    isNextPackage() {
        return this._package instanceof NextPackage;
    }

    showStartMessage(){
        this.inlineLogSuccess(`Starting ${this.getDefinition().name}...`);
    }

    showEndMessage(){
        this.inlineLogSuccess(`Finished ${this.getDefinition().name}`);
        process.exit(1);
    }

    setSpinner(title) {
        this._spinner = new Spinner.Spinner(colors.yellow(title));
        this._spinner.setSpinnerString('|/-\\');
    }

    startSpinner(){
        this._spinner.start();
    }

    stopSpinner(){
        this._spinner.stop();
    }

    _setProgressBar() {
        this._progressBar = new CliProgress.SingleBar({}, CliProgress.Presets.shades_classic);
    }

    startProgressBar(totalValue, startValue) {
        this.stopSpinner();
        this._progressBar.start(totalValue, startValue);
    }

    stopProgressBar() {
        this._progressBar.stop();
    }

    updateProgressBar(barCount) {
        this._progressBar.update(barCount);
    }

    compileTemplate(templateFile, data) {
        const template = readFileSync(resolve(this.getApplicationTemplateDirectory(), templateFile), 'utf8');
        return _template(template)(data);
    }
}
