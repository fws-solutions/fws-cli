import CommandDefinition from "../base/domain/Command/CommandDefinition.js";
import BaseCommand from "../base/domain/Command/BaseCommand.js";
import { spawn } from 'child_process';

export default class Npm extends BaseCommand {
    constructor() {
        super(
            new CommandDefinition( 'npm-i', 'install node modules')
                .setAlias('i')
                .setIsStandAlone(true)
        );
    }

    run() {
         this._npmInstall();
    }

     _npmInstall() {
        const config = {
            stdio: 'inherit',
            cwd: this.package.getProjectRoot()
        };

        const command = /^win/.test(process.platform) ? 'npm.cmd' : 'npm';
        const script =  spawn(command, ['i'], config);

        script.on('close', (code) => {
            switch (code){
                case 1:
                    this.consoleLogError(`Install failed!`);
                    break;
                case 0:
                    this.consoleLogSuccess(`node_modules installed in the root '${this.package.getProjectRoot()}'.`);
                    break;
                default :
                    this.consoleLogWarning(`Unknown install state! Response code: ${code}`);
                    break;
            }
            process.exit(code);
        });
    }
}
