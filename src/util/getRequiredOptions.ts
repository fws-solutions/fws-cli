import { ICommand, IOption } from 'src/interfaces/interfaces';

export const getRequiredOptions = (command: ICommand): Array<IOption> => {
    if (!command.mandatoryOptions?.length) return [];

    return command.mandatoryOptions.map((option) => ({
        command: `${option.command}`,
        description: `${option.description}`,
    }));
};
