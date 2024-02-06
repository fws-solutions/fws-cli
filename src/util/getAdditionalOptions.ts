import { ICommand, IOption } from 'src/interfaces/interfaces';

export const getAdditionalOptions = (command: ICommand): Array<IOption> => {
    const returnOptions: Array<IOption> = [];
    if (command?.additionalOptions?.length) {
        command.additionalOptions.forEach((option) => {
            returnOptions.push({ command: `${option.command}`, description: `${option.description}` });
        });
    }
    return returnOptions;
};
