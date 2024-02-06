import { getPackageJsonAndRootPath } from '../util/getPackageJsonAndRootPath';
import { IPackageMetadata } from '../interfaces/interfaces';
import { resolvePackageJson } from '../util/resolvePackageJson';
import { getPackageType } from '../util/getPackageType';
import { getAssetsDir } from '../util/getAssetsDir';

export const getPackageMetadata = (): IPackageMetadata => {
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
        projectRoot: paths?.rootPath,
        packageJsonDir: paths?.jsonPath,
        assetsDir: getAssetsDir(packageType, paths.rootPath),
        packageType: packageType,
        packageJson: packageJson,
        isValid: true,
    };
};
