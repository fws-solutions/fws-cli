import { getMessageBasedOnCode } from '../util/getMessageBasedOnCode.js';
import { resolvePackageJson } from '../util/resolvePackageJson.js';
import { exec } from 'child_process';
import { getPackageMetadata } from '../package/index.js';

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
                const config = {
                    shell: true,
                    cwd: packageMetadata.projectRoot,
                };
                const childProcess = exec(`npm run ${script}`, config);

                childProcess.on('close', (code) => {
                    console.log(getMessageBasedOnCode(code, script));
                    throw new Error(`Script ${script} failed with code ${code}`);
                });
            },
        };
        commandList.push(command);
    });
    return commandList;
};
