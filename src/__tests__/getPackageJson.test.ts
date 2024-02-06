import { getPackageJson } from '../util/getPackageJson'; // Import your module
import { readFileSync } from 'fs';

jest.mock('fs');

describe('util/getPackageJson.ts - testing package.json paths', () => {
    it('should return parsed JSON object when reading and parsing is successful', () => {
        const mockPackageJson = { name: 'mock-package', version: '1.0.0' };
        const path = 'path/to/package.json';
        (readFileSync as jest.MockedFunction<typeof readFileSync>).mockReturnValueOnce(JSON.stringify(mockPackageJson));
        const result = getPackageJson(path);
        expect(result).toEqual(mockPackageJson);
    });

    it('should return empty object when file reading or parsing fails', () => {
        const path = 'path/to/invalid-package.json';
        (readFileSync as jest.MockedFunction<typeof readFileSync>).mockImplementationOnce(() => {
            throw new Error('File not found');
        });
        const result = getPackageJson(path);
        expect(result).toEqual({});
    });
});
