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

export default class BaseCommand {
    _definition;
    _package;

    constructor(definition) {
        if (!(definition instanceof CommandDefinition)) throw new Error('Missing command definition!')
        this._definition = definition;
        this._setPackage();
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

    // Logging and error handling

    consoleLogWarning(message, color = 'yellow', error = false) {
        /* Log warning messages using a template.  */
        const warningTemplate = readFileSync(resolve(this.getApplicationTemplateDirectory(), 'temp-warning-log.txt'), 'utf8');
        const compiled = _template(warningTemplate);
        fancyLog(colors[color](compiled({message: message})));

        if (error) {
            this.notifyError(message);
            process.exit(1);
        }
    }

    consoleLogError(message) {
        fancyLog(colors.red(message));
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
}
