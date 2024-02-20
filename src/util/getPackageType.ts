import { PACKAGE_TYPES } from '../consts/packageTypes';

export const getPackageType = (packageJson: Record<string, string> | null | undefined): string => {
    if (!packageJson || !packageJson.hasOwnProperty('forwardslash')) return 'unknown';
    return PACKAGE_TYPES[packageJson.forwardslash as keyof typeof PACKAGE_TYPES].type;
};
