import { exec } from 'child_process';
import { isWin } from './isWin';

export const getLatestVersion = () => {
    return new Promise((resolve, reject) => {
        let output = '';
        const command = isWin() ? 'npm.cmd' : 'npm';
        const script = exec(`${command} view @forwardslashns/fws-cli version`, { shell: true });

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
