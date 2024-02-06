import { Command } from 'commander';
import { resolvePackageJson } from '../util/resolvePackageJson';
import { getAllowedCommands } from '../util/getAllowedCommands';
import { version } from '../../package.json';
import { getPackageJsonCommands } from '../commands/packageJsonCommands';
import { getCommands } from '../util/getCommands';
import { commands as fsCommands } from '../commands';
import { getAdditionalOptions } from '../util/getAdditionalOptions';
import { getRequiredOptions } from '../util/getRequiredOptions';
import { ICommand } from '../interfaces/interfaces';
export const getCommander = () => {
    const program = new Command();
    const packageJson = resolvePackageJson();
    const allowedCommands = getAllowedCommands(packageJson);
    const packageJsonCommands = getPackageJsonCommands();
    program.version(version);
    const commands = getCommands(fsCommands, packageJsonCommands, allowedCommands);

    commands.forEach((command: ICommand) => {
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
