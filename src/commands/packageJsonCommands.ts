import { getMessageBasedOnCode } from '../util/getMessageBasedOnCode';
import { isWin } from '../util/isWin';
import { ICommand } from '../interfaces/interfaces';
import { resolvePackageJson } from '../util/resolvePackageJson';
import { spawn, SpawnOptions } from 'child_process';
import { getPackageMetadata } from '../package';

export const getPackageJsonCommands = (): Array<ICommand> => {
    const packageJson = resolvePackageJson();
    const scripts = packageJson?.scripts;
    if (!scripts || !Object.keys(scripts).length) return [];
    const commandList: Array<ICommand> = [];
    Object.keys(scripts).forEach((script) => {
        if (script === 'postinstall') return;
        const command: ICommand = {
            name: script,
            description: `runs the ${script} script`,
            run: () => {
                const packageMetadata = getPackageMetadata();
                if (!packageMetadata?.isValid) process.exit(1);
                const config: SpawnOptions = {
                    stdio: 'inherit',
                    cwd: packageMetadata.projectRoot,
                };
                const commandToRun = isWin() ? 'npm.cmd' : 'npm';
                const childProcess = spawn(commandToRun, ['run', script], config);

                childProcess.on('close', (code: number) => {
                    console.log(getMessageBasedOnCode(code, script));
                    process.exit(code);
                });
            },
        };
        commandList.push(command);
    });
    return commandList;
};
