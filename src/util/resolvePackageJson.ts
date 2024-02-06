import { getPackageJson } from './getPackageJson';
import { getPackageJsonAndRootPath } from './getPackageJsonAndRootPath';

export const resolvePackageJson = (): Record<string, string> | undefined | null => {
    const paths = getPackageJsonAndRootPath();
    if (!paths.jsonPath) return null;
    const packageJson = getPackageJson(paths.jsonPath);
    return packageJson;
};
