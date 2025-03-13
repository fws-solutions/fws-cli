import { resolvePackageJson } from '../util/resolvePackageJson.js';
import { spawn } from 'child_process';
import { getPackageMetadata } from '../package/index.js';
import { isWin } from '../util/isWin.js';

export const getPackageJsonCommands = () => {
    const packageJson = resolvePackageJson();
    const scripts = packageJson?.scripts;
    if (!scripts || !Object.keys(scripts).length) return [];
    const commandList = [];
    Object.keys(scripts).forEach((script) => {
        if (script === 'postinstall') return;
        const command = {
            name: script,
            description: `runs the ${script} script`,
            run: () => {
                const packageMetadata = getPackageMetadata();
                if (!packageMetadata?.isValid) throw new Error(`Script ${script} failed with code 1`);

                const npmCommand = isWin() ? 'npm.cmd' : 'npm';

                const childProcess = spawn(npmCommand, ['run', script], {
                    cwd: packageMetadata.projectRoot,
                    stdio: 'inherit',
                    shell: true,
                });

                childProcess.on('close', (code) => {
                    process.exit(code);
                });
            },
        };
        commandList.push(command);
    });
    return commandList;
};
