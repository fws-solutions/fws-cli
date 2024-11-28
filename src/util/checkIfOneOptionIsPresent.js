export const checkIfOneOptionIsPresent = (options, args) => {
    if (!options || !options.length || !args || !args.length)
        return { message: 'Error parsing options', shouldExit: true };
    const countArgs = args.filter(Boolean).length;
    let message = '';
    if (countArgs !== 1) {
        message = `Please specify exactly one of the options: ${options.map((option) => option.command).join(', ')}`;
    }

    return { message, shouldExit: countArgs !== 1 };
};
