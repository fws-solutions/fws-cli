import { getPackageJsonAndRootPath } from '../util/getPackageJsonAndRootPath';
import { existsSync, readdirSync } from 'fs';
import { resolve } from 'path';

jest.mock('fs');

describe('util/getPackageJsonPath - testing package.json directories', () => {
    it('should return path to theme package.json if themes directory exists', async () => {
        const themesDir = ['fws-theme'];
        const cwd = process.cwd();
        (existsSync as jest.Mock).mockReturnValueOnce(true);
        (readdirSync as jest.Mock).mockReturnValueOnce(themesDir);
        const result = getPackageJsonAndRootPath();
        expect(result?.jsonPath).toEqual(resolve(cwd, 'wp-content', 'themes', 'fws-theme', 'package.json'));
    });
    it('should return path to root package.json if themes directory does not exist', () => {
        const cwd = process.cwd();
        (existsSync as jest.Mock).mockReturnValueOnce(false);
        const result = getPackageJsonAndRootPath();
        expect(result?.jsonPath).toEqual(resolve(cwd, 'package.json'));
    });

    it('should handle errors and return undefined', () => {
        (existsSync as jest.Mock).mockImplementationOnce(() => {
            throw new Error('Error checking directory existence');
        });

        const result = getPackageJsonAndRootPath();

        expect(result).toEqual({ jsonPath: '', rootPath: '' });
    });
});
