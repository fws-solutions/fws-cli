import { getMessageBasedOnCode } from '../util/getMessageBasedOnCode.js';
import { exec } from 'child_process';
import { getPackageMetadata } from '../package/index.js';

const npmci = {
    name: 'npmci',
    description: 'clean install node modules',
    alias: 'ci',
    run() {
        const packageMetadata = getPackageMetadata();
        if (!packageMetadata?.isValid) throw new Error('Npm clean install failed.', 1);
        const config = {
            shell: true,
            cwd: packageMetadata.projectRoot,
        };
        const childProcess = exec(`npm ci`, config);

        childProcess.on('close', (code) => {
            console.log(getMessageBasedOnCode(code, 'npm clean install'));
            throw new Error('Npm clean install failed.', code);
        });
    },
};

npmci.run = npmci.run.bind(npmci);

export { npmci };
