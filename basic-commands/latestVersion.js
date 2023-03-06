import CommandDefinition from "../base/domain/Command/CommandDefinition.js";
import BaseCommand from "../base/domain/Command/BaseCommand.js";
import { spawn } from 'child_process';
import {dirname, resolve} from "path";
import {fileURLToPath} from "url";
import {readFileSync} from "fs";
import figlet from 'figlet';
import colors from 'ansi-colors';

export default class LatestVersion extends BaseCommand {
    constructor() {
        super(
            new CommandDefinition( 'latest-version', 'check for latest CLI version')
                .setAlias('latest')
                .setIsStandAlone(true)
        );
    }

    async run() {
        try{
            this.setSpinner('%s ...checking latest @fws/cli version...');
            this.startSpinner();
            const latestVersion = await this._getLatestVersion();
            this.stopSpinner();
            this._showMessage(latestVersion);
        } catch (exception) {
            this.stopSpinner();
            console.log('Failed');
        }
        // this._getLatestVersion().then(latestVersion => this._showMessage(latestVersion));
    }

    _getLatestVersion() {
        return new Promise((resolve, reject) => {
            let output = '';
            const command = /^win/.test(process.platform) ? 'npm.cmd' : 'npm';
            const script = spawn(command, ['view', '@fws/cli', 'version']);

            script.stdin.setEncoding = 'utf-8';
            script.stdout.on('data', (data) => {
                output += data.toString();
            });

            script.stderr.on('data', (data) => reject(data));
            script.on('close', () => {
                resolve(output);
            });
        });
    }

    _getCurrentVersion() {
        const packageJson = resolve(dirname(fileURLToPath(import.meta.url)), '../package.json');
        return JSON.parse(readFileSync(packageJson, 'utf8')).version;
    }

    _showMessage(latestVersion){
        let report = '';
        const currentVersion = this._getCurrentVersion();
        const updateNeeded = currentVersion !== latestVersion.trim();
        // const updateNeeded = '1.0.0' !== currentVersion.trim();

        const message = `You${updateNeeded ? ' DO NOT' : ''} have the latest version of ${colors['magenta']('@fws/cli')} installed!`;

        figlet(updateNeeded ? 'Update Needed!' : 'All Good!', {font: 'Small Slant'}, function(err, data) {
            if (err) {
                console.log('Something went wrong...');
                console.dir(err);
                return;
            }

            report += '\n' + colors[updateNeeded ? 'red' : 'cyan'](data);
            report += '\n\n' + colors[updateNeeded ? 'red' : 'grey'](message);
            report += '\n\n' + colors['cyan'](`Latest version: ${latestVersion}`);
            report += colors[updateNeeded ? 'red' : 'cyan'](`Local version: ${currentVersion}`) + '\n';

            console.log(report);
            process.exit(1);
        });
    }
}
