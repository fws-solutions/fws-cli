import { getPackageJsonAndRootPath } from '../util/getPackageJsonAndRootPath.js';
import { resolvePackageJson } from '../util/resolvePackageJson.js';
import { getPackageType } from '../util/getPackageType.js';
import { getAssetsDir } from '../util/getAssetsDir.js';

export const getPackageMetadata = () => {
    const paths = getPackageJsonAndRootPath();
    const packageJson = resolvePackageJson();
    const packageType = getPackageType(packageJson);
    if (!paths || !paths.jsonPath || !paths.rootPath || !packageJson || !packageType || packageType === 'unknown')
        return {
            projectRoot: '',
            packageJsonDir: '',
            assetsDir: '',
            packageType: '',
            packageJson: null,
            isValid: false,
        };

    return {
        projectRoot: paths.rootPath,
        packageJsonDir: paths.jsonPath,
        assetsDir: getAssetsDir(packageType, paths.rootPath),
        packageType: packageType,
        packageJson: packageJson,
        isValid: true,
    };
};
