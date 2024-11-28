export const getRequiredOptions = (command) => {
    if (!command.mandatoryOptions?.length) return [];

    return command.mandatoryOptions.map((option) => ({
        command: `${option.command}`,
        description: `${option.description}`,
    }));
};
