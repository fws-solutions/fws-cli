import { spawn } from 'child_process';
import { isWin } from './isWin';

export const getLatestVersion = (): Promise<string> => {
    return new Promise((resolve, reject) => {
        let output = '';
        const command = isWin() ? 'npm.cmd' : 'npm';
        const script = spawn(command, ['view', '@fws/cli', 'version']);

        script.stdout.setEncoding('utf-8');
        script.stdout.on('data', (data) => {
            output += data.toString();
        });

        script.stderr.on('data', (data) => reject(data));
        script.on('close', () => {
            resolve(output);
        });
    });
};
