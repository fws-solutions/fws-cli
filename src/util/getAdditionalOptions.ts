import { ICommand, IOption } from 'src/interfaces/interfaces';

export const getAdditionalOptions = (command: ICommand): Array<IOption> => {
    if (!command.additionalOptions?.length) return [];
    return command.additionalOptions.map((option) => ({
        command: `${option.command}`,
        description: `${option.description}`,
    }));
};
