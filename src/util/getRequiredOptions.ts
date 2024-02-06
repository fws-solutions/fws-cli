import { ICommand, IOption } from 'src/interfaces/interfaces';

export const getRequiredOptions = (command: ICommand): Array<IOption> => {
    const returnOptions: Array<IOption> = [];
    if (command?.mandatoryOptions?.length) {
        command.mandatoryOptions.forEach((option) => {
            returnOptions.push({ command: `${option.command}`, description: `${option.description}` });
        });
    }
    return returnOptions;
};
