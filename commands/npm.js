import CommandDefinition from "../base/domain/Command/CommandDefinition.js";
import BaseCommand from "../base/domain/Command/BaseCommand.js";
import { spawn } from 'child_process';

export default class Npm extends BaseCommand {
    constructor() {
        super(
            new CommandDefinition( 'npm-i', 'install node modules')
                .setAlias('i')
        );
    }

    run() {
         this._npmInstall();
    }

     _npmInstall() {
        this.setSpinner('%s ...getting ready for \'npm install\'...');
        this.startSpinner();

        setTimeout(async () => {
            this.stopSpinner();

            const config = {
                stdio: 'inherit',
                cwd: this.package.getProjectRoot()
            };

            const command = /^win/.test(process.platform) ? 'npm.cmd' : 'npm';
            const script = await spawn(command, ['i'], config);

            script.on('close', () => {
                this.consoleLogSuccess(`node_modules installed in the root '${this.package.getProjectRoot()}'.`);
            });
        }, 1500);
    }
}
