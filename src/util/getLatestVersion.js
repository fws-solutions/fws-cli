import { spawn, exec } from 'child_process';

export const getLatestVersion = () => {
    return new Promise((resolve, reject) => {
        let output = '';
        const script = exec(`npm view @forwardslashns/fws-cli version`, { shell: true });

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
