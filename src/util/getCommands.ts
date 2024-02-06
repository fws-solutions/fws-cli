import { ICommand } from '../interfaces/interfaces';

export const getCommands = (
    cliCommands: Array<ICommand>,
    packageJsonCommands: Array<ICommand>,
    allowedCommands: Array<string>
) => {
    return [
        ...cliCommands.filter((command: ICommand) => allowedCommands.includes(command.name)),
        ...packageJsonCommands,
    ];
};
