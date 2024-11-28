import { Command } from 'commander';
import { resolvePackageJson } from '../util/resolvePackageJson.js';
import { getAllowedCommands } from '../util/getAllowedCommands.js';
import { getPackageJsonCommands } from '../commands/packageJsonCommands.js';
import { getCommands } from '../util/getCommands.js';
import { commands as fsCommands } from '../commands/index.js';
import { getAdditionalOptions } from '../util/getAdditionalOptions.js';
import { getRequiredOptions } from '../util/getRequiredOptions.js';
export const getCommander = () => {
    const program = new Command();
    const packageJson = resolvePackageJson();
    const allowedCommands = getAllowedCommands(packageJson);
    const packageJsonCommands = getPackageJsonCommands();
    program.version(packageJson.version);
    const commands = getCommands(fsCommands, packageJsonCommands, allowedCommands);

    commands.forEach((command) => {
        const cmd = program.command(command.name);
        cmd.description(command.description);
        command.alias && cmd.alias(command.alias);
        getRequiredOptions(command).forEach((option) => {
            cmd.requiredOption(option.command, option.description);
        });
        getAdditionalOptions(command).forEach((option) => {
            cmd.option(option.command, option.description);
        });
        cmd.action(command.run);
    });

    return program;
};
