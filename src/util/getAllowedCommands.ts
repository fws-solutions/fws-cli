import { PACKAGE_TYPES } from '../consts/packageTypes';

export const getAllowedCommands = (packageJson: Record<string, string> | null | undefined): Array<string> => {
    if (!packageJson || !packageJson.hasOwnProperty('forwardslash')) return [];
    return PACKAGE_TYPES[packageJson.forwardslash as keyof typeof PACKAGE_TYPES].allowedCommands;
};
