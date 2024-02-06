import { IOption } from '../interfaces/interfaces';
interface ICheck {
    message: string;
    shouldExit: boolean;
}
export const checkIfOneOptionIsPresent = (options: Array<IOption>, args: Array<boolean>): ICheck => {
    if (!options || !options.length || !args || !args.length)
        return { message: 'Error parsing options', shouldExit: true };
    const countArgs = args.filter(Boolean).length;
    let message = '';
    if (countArgs !== 1) {
        message = `Please specify exactly one of the options: ${options.map((option) => option.command).join(', ')}`;
    }

    return { message, shouldExit: countArgs !== 1 };
};
