import { getMessageBasedOnCode } from '../util/getMessageBasedOnCode.js';
import { spawn } from 'child_process';
import { isWin } from '../util/isWin.js';
import { getPackageMetadata } from '../package/index.js';

const npmci = {
    name: 'npmci',
    description: 'clean install node modules',
    alias: 'ci',
    run() {
        const packageMetadata = getPackageMetadata();
        if (!packageMetadata?.isValid) throw new Error('Npm clean install failed.', 1);
        const config = {
            stdio: 'inherit',
            cwd: packageMetadata.projectRoot,
        };
        const command = isWin() ? 'npm.cmd' : 'npm';
        const childProcess = spawn(command, ['ci'], config);

        childProcess.on('close', (code) => {
            console.log(getMessageBasedOnCode(code, 'npm clean install'));
            throw new Error('Npm clean install failed.', code);
        });
    },
};

npmci.run = npmci.run.bind(npmci);

export { npmci };
