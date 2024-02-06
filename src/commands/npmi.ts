import { ICommand } from '../interfaces/interfaces';
import { getMessageBasedOnCode } from '../util/getMessageBasedOnCode';
import { spawn, SpawnOptions } from 'child_process';
import { isWin } from '../util/isWin';
import { getPackageMetadata } from '../package';

const npmi: ICommand = {
    name: 'npmi',
    description: 'install node modules',
    alias: 'i',
    run() {
        const packageMetadata = getPackageMetadata();
        if (!packageMetadata?.isValid) process.exit(1);
        const config: SpawnOptions = {
            stdio: 'inherit',
            cwd: packageMetadata.projectRoot,
        };
        const command = isWin() ? 'npm.cmd' : 'npm';
        const childProcess = spawn(command, ['i'], config);

        childProcess.on('close', (code: number) => {
            console.log(getMessageBasedOnCode(code, 'npm install'));
            process.exit(code);
        });
    },
};

npmi.run = npmi.run.bind(npmi);

export { npmi };
