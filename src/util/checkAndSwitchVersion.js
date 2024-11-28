import { spawn } from 'child_process';
import * as path from 'path';

export const checkAndSwitchVersion = (version) => {
    const nvmPath = path.resolve(process.env.HOME || '', '.nvm/nvm.sh');
    const checkVersion = spawn('bash', ['-c', `. ${nvmPath} && nvm list ${version}`]);

    console.log(nvmPath);

    checkVersion.stdout.on('data', (data) => {
        const stdout = data.toString();
        if (stdout.includes(version)) {
            console.log(`${version} already installed`);
            switchVersion(version);
        } else {
            console.log(`${version} not found. Installing...`);
            installVersion(version);
        }
    });

    checkVersion.on('error', (error) => {
        console.error(`Error: ${error.message}`);
    });
}

function installVersion(version) {
    const nvmPath = path.resolve(process.env.HOME || '', '.nvm/nvm.sh');
    const installNewVersion = spawn('bash', ['-c', `. ${nvmPath} && nvm install ${version}`]);

    installNewVersion.stderr.on('data', (data) => {
        console.error(`stderr: ${data.toString()}`);
    });

    installNewVersion.on('close', (code) => {
        if (code === 0) {
            console.log(`${version} successfully installed`);
            switchVersion(version);
        } else {
            console.error(`Installation failed with code ${code}`);
        }
    });
}

function switchVersion(version) {
    const nvmPath = path.resolve(process.env.HOME || '', '.nvm/nvm.sh');
    const command = spawn('bash', ['-c', `. ${nvmPath} && nvm use ${version}`]);

    command.stdout.on('data', () => {
        console.log(`Version switched to ${version}`);
    });

    command.on('error', (error) => {
        console.error(`Error: ${error.message}`);
    });
}