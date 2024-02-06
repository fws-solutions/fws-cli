import { ICommand } from '../interfaces/interfaces';
import { getMessageBasedOnCode } from '../util/getMessageBasedOnCode';
import { spawn, SpawnOptions } from 'child_process';
import { isWin } from '../util/isWin';
import { getPackageMetadata } from '../package';

const npmci: ICommand = {
    name: 'npmci',
    description: 'clean install node modules',
    alias: 'ci',
    run() {
        const packageMetadata = getPackageMetadata();
        if (!packageMetadata?.isValid) process.exit(1);
        const config: SpawnOptions = {
            stdio: 'inherit',
            cwd: packageMetadata.projectRoot,
        };
        const command = isWin() ? 'npm.cmd' : 'npm';
        const childProcess = spawn(command, ['ci'], config);

        childProcess.on('close', (code: number) => {
            console.log(getMessageBasedOnCode(code, 'npm clean install'));
            process.exit(code);
        });
    },
};

npmci.run = npmci.run.bind(npmci);

export { npmci };
