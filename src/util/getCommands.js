export const getCommands = (cliCommands, packageJsonCommands, allowedCommands) => {
    return [...cliCommands.filter((command) => allowedCommands.includes(command.name)), ...packageJsonCommands];
};
