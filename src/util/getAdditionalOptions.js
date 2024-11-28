export const getAdditionalOptions = (command) => {
    if (!command.additionalOptions?.length) return [];
    return command.additionalOptions.map((option) => ({
        command: `${option.command}`,
        description: `${option.description}`,
    }));
};
