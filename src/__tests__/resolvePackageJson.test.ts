import { resolvePackageJson } from '../util/resolvePackageJson';
import { getPackageJsonAndRootPath } from '../util/getPackageJsonAndRootPath';
import { getPackageJson } from '../util/getPackageJson';

jest.mock('../util/getPackageJsonAndRootPath');
jest.mock('../util/getPackageJson');

describe('util/resolvePackageJson - testing if it returns correct json', () => {
    it('should return null if packageJsonPath is null', () => {
        (getPackageJsonAndRootPath as jest.Mock).mockResolvedValueOnce(null);
        const result = resolvePackageJson();
        expect(result).toBeNull();
        expect(getPackageJson).not.toHaveBeenCalled();
    });

    it('should return null if packageJsonPath is undefined', () => {
        (getPackageJsonAndRootPath as jest.Mock).mockResolvedValueOnce(undefined);
        const result = resolvePackageJson();
        expect(result).toBeNull();
        expect(getPackageJson).not.toHaveBeenCalled();
    });

    it('should return packageJson if packageJsonPath is valid', () => {
        const packageJsonPath = { rootPath: '/path/to/', jsonPath: '/path/to/package.json' };
        const mockPackageJson = { name: 'mock-package', version: '1.0.0' };
        (getPackageJsonAndRootPath as jest.Mock).mockReturnValueOnce(packageJsonPath);
        (getPackageJson as jest.Mock).mockReturnValueOnce(mockPackageJson);
        const result = resolvePackageJson();
        expect(result).toEqual(mockPackageJson);
        expect(getPackageJson).toHaveBeenCalledWith(packageJsonPath.jsonPath);
    });
});
