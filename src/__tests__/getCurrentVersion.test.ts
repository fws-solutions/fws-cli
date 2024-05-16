import { getCurrentVersion } from '../util/getCurrentVersion';
import fs from 'fs';

jest.mock('fs');

describe('util/getCurrentVersion - testing get current version from project', () => {
    it('should return the current version from package.json', () => {
        const mockPackageJsonContent = '{"version": "1.0.0"}';

        jest.spyOn(fs, 'readFileSync').mockReturnValueOnce(mockPackageJsonContent);

        const version = getCurrentVersion();

        expect(fs.readFileSync).toHaveBeenCalledWith(expect.any(String), 'utf8');
        expect(version).toBe('1.0.0');
    });

    it('should handle invalid JSON in package.json', () => {
        jest.spyOn(fs, 'readFileSync').mockReturnValueOnce('invalid-json');

        const version = getCurrentVersion();

        expect(fs.readFileSync).toHaveBeenCalledWith(expect.any(String), 'utf8');
        expect(version).toBe('');
    });
});
