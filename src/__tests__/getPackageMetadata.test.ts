import { getPackageMetadata } from '../package';
import { getPackageJsonAndRootPath } from '../util/getPackageJsonAndRootPath';
import { resolvePackageJson } from '../util/resolvePackageJson';
import { getPackageType } from '../util/getPackageType';
import { getAssetsDir } from '../util/getAssetsDir';
import { IPackageMetadata } from '../interfaces/interfaces';

jest.mock('../util/getPackageJsonAndRootPath');
jest.mock('../util/resolvePackageJson');
jest.mock('../util/getPackageType');
jest.mock('../util/getAssetsDir');

describe('package/getPackageMetadata - testing package metadata', () => {
    it('should return result.isValid as false if json is incorrect', () => {
        (getPackageJsonAndRootPath as jest.Mock).mockReturnValueOnce({ jsonPath: '', rootPath: '' });
        (resolvePackageJson as jest.Mock).mockReturnValueOnce(null);
        (getPackageType as jest.Mock).mockReturnValueOnce('unknown');
        const expectedResult: IPackageMetadata = {
            projectRoot: '',
            packageJsonDir: '',
            assetsDir: '',
            packageType: '',
            packageJson: null,
            isValid: false,
        };
        const result = getPackageMetadata();
        expect(result.isValid).toEqual(expectedResult.isValid);
    });

    it('should return null if package type is unknown', () => {
        (getPackageJsonAndRootPath as jest.Mock).mockReturnValueOnce({
            jsonPath: '/path/to/package.json',
            rootPath: '/path/to/root',
        });
        (resolvePackageJson as jest.Mock).mockReturnValueOnce({ name: 'test-package', version: '1.0.0' });
        (getPackageType as jest.Mock).mockReturnValueOnce('unknown');
        const expectedResult: IPackageMetadata = {
            projectRoot: '',
            packageJsonDir: '',
            assetsDir: '',
            packageType: '',
            packageJson: null,
            isValid: false,
        };
        const result = getPackageMetadata();
        expect(result).toStrictEqual(expectedResult);
    });

    it('should return package metadata if all data is available', () => {
        const packageJson = { name: 'test-package', version: '1.0.0' };
        const packageType = 'vue';
        const paths = { jsonPath: '/path/to/package.json', rootPath: '/path/to/root' };
        const assetsDir = '/path/to/assets';
        (getPackageJsonAndRootPath as jest.Mock).mockReturnValueOnce(paths);
        (resolvePackageJson as jest.Mock).mockReturnValueOnce(packageJson);
        (getPackageType as jest.Mock).mockReturnValueOnce(packageType);
        (getAssetsDir as jest.Mock).mockReturnValueOnce(assetsDir);
        const expectedResult: IPackageMetadata = {
            projectRoot: paths.rootPath,
            packageJsonDir: paths.jsonPath,
            assetsDir: assetsDir,
            packageType: packageType,
            packageJson: packageJson,
            isValid: true,
        };
        const result = getPackageMetadata();
        expect(result).toEqual(expectedResult);
    });
});
