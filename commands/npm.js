import CommandDefinition from "../base/domain/Command/CommandDefinition.js";
import BaseCommand from "../base/domain/Command/BaseCommand.js";
import { spawn } from 'child_process';

export default class Npm extends BaseCommand {
    constructor() {
        super(
            new CommandDefinition('npm-i', 'install node modules')
        );
    }

    run() {
        this.showStartMessage();
        this._npmInstall();
    }

    _npmInstall() {
        const path = this.package.getProjectRoot();
        this.setSpinner('%s ...getting ready for \'npm install\'...');
        this.startSpinner();

        setTimeout(() => {
            this.stopSpinner();

            const config = {
                stdio: 'inherit',
                cwd: path
            };
            const command = /^win/.test(process.platform)? 'npm.cmd' : 'npm';
            const script = spawn(command, ['i'], config);

            script.on('close', () => {
                this.consoleLogSuccess(`node_modules installed in the root '${path}'.`);
                this.showEndMessage();
            });
        }, 1500);
    }
}
