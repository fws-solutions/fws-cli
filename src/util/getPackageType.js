import { PACKAGE_TYPES } from '../consts/packageTypes.js';

export const getPackageType = (packageJson) => {
    if (!packageJson || !packageJson['forwardslash']) return 'unknown';
    return PACKAGE_TYPES[packageJson.forwardslash].type;
};
