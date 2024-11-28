import { getMessageBasedOnCode } from '../util/getMessageBasedOnCode.js';
import { spawn } from 'child_process';
import { isWin } from '../util/isWin.js';
import { getPackageMetadata } from '../package/index.js';

const npmi = {
    name: 'npmi',
    description: 'install node modules',
    alias: 'i',
    run() {
        const packageMetadata = getPackageMetadata();
        if (!packageMetadata?.isValid) throw new Error(`Script: npm install falied with code: 1`);
        const config = {
            stdio: 'inherit',
            cwd: packageMetadata.projectRoot,
        };
        const command = isWin() ? 'npm.cmd' : 'npm';
        const childProcess = spawn(command, ['i'], config);

        childProcess.on('close', (code) => {
            console.log(getMessageBasedOnCode(code, 'npm install'));
            throw new Error(`Script: npm install falied with code: ${code}`);
        });
    },
};

npmi.run = npmi.run.bind(npmi);

export { npmi };