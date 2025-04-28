import { getMessageBasedOnCode } from '../util/getMessageBasedOnCode.js';
import { isWin } from '../util/isWin.js';
import { getPackageMetadata } from '../package/index.js';
import { spawn } from 'node:child_process';

const npmi = {
    name: 'npmi',
    description: 'install node modules',
    alias: 'i',
    run() {
        const packageMetadata = getPackageMetadata();
        if (!packageMetadata?.isValid) throw new Error(`Script: npm install falied with code: 1`);

        const command = isWin() ? 'npm.cmd' : 'npm';
        const args = ['install'];
        const config = {
            shell: true,
            cwd: packageMetadata.projectRoot,
            stdio: 'inherit',
        };

        const childProcess = spawn(command, args, config);

        childProcess.on('close', (code) => {
            console.log(getMessageBasedOnCode(code, 'npm install'));
            if (code !== 0) {
                throw new Error(`Script: npm install failed with code: ${code}`);
            }
        });
    },
};

npmi.run = npmi.run.bind(npmi);

export { npmi };
