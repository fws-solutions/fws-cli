import CommandDefinition from "../base/domain/Command/CommandDefinition.js";
import BaseCommand from "../base/domain/Command/BaseCommand.js";
import {resolve} from "path";
import fs from "fs";

export default class Postinstall extends BaseCommand {
    constructor() {
        super(
            new CommandDefinition('postinstall', 'runs postinstall script')
        );
    }

    run() {
        this._createEnv();
    }

    _createEnv() {
        let template;
        let message;

        if (this.isWPPackage()) {
            template = resolve(this.getApplicationEnvDirectory(), 'example-s.env');
            message = 'theme directory';
        } else if (this.isNuxtPackage()) {
            template = resolve(this.getApplicationEnvDirectory(), 'example-nuxt.env');
            message = 'Nuxt project';
        } else {
            return;
        }

        const env = resolve(this.package.getProjectRoot(), '.env');
        const exampleEnv = resolve(this.package.getProjectRoot(), '.env.example');

        if (!fs.existsSync(exampleEnv)) {
            try {
                fs.copyFileSync(template, exampleEnv);
                this.consoleLogSuccess(`Generated '.env.example' file in the root of the ${message}.`);
            } catch (exception) {
                this.inlineLogError(exception);
            }
        } else {
            this.consoleLogWarning(`WARNING: '.env.example' already exists!`);
        }

        if (!fs.existsSync(env)) {
            try {
                fs.copyFileSync(template, env);
                this.consoleLogSuccess(`Generated '.env file' in the root of the ${message}. Please configure your local environment.`);
            } catch (exception) {
                this.inlineLogError(exception);
            }
        } else {
            this.consoleLogWarning(`WARNING: '.env' already exists!`);
        }
    }
}
