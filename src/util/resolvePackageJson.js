import { getPackageJson } from './getPackageJson.js';
import { getPackageJsonAndRootPath } from './getPackageJsonAndRootPath.js';

export const resolvePackageJson = () => {
    const paths = getPackageJsonAndRootPath();
    if (!paths.jsonPath) return null;
    const packageJson = getPackageJson(paths.jsonPath);
    return packageJson;
};
