import { PACKAGE_TYPES } from '../consts/packageTypes.js';

export const getAllowedCommands = (packageJson) => {
    if (!packageJson || !packageJson['forwardslash'] || !Object.keys(PACKAGE_TYPES).includes(packageJson.forwardslash))
        return PACKAGE_TYPES.fws_global.allowedCommands;
    return PACKAGE_TYPES[packageJson.forwardslash].allowedCommands;
};
