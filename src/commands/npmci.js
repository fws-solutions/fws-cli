import { getMessageBasedOnCode } from '../util/getMessageBasedOnCode.js';
import { getPackageMetadata } from '../package/index.js';
import { isWin } from '../util/isWin.js';
import { spawn } from 'node:child_process';

const npmci = {
    name: 'npmci',
    description: 'clean install node modules',
    alias: 'ci',
    run() {
        const packageMetadata = getPackageMetadata();
        if (!packageMetadata?.isValid) throw new Error('Npm clean install failed.', 1);

        const command = isWin() ? 'npm.cmd' : 'npm';
        const args = ['ci'];
        const config = {
            shell: true,
            cwd: packageMetadata.projectRoot,
            stdio: 'inherit',
        };

        const childProcess = spawn(command, args, config);

        childProcess.on('close', (code) => {
            console.log(getMessageBasedOnCode(code, 'npm clean install'));
            if (code !== 0) {
                throw new Error(`Npm clean install failed with code: ${code}`);
            }
        });
    },
};

npmci.run = npmci.run.bind(npmci);

export { npmci };
