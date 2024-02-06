import { getFiles } from '../util/getFiles';

jest.mock('fs', () => ({
    readdirSync: jest.fn(),
    statSync: jest.fn(),
}));
describe('util/getFiles - testing get files', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });
    it('returns an array of files with the specified extension and starting characters', () => {
        const mockReaddirSync = jest.fn();
        const mockStatSync = jest.fn();
        mockReaddirSync.mockImplementation((path) => {
            if (path.endsWith('/path/to/directory')) {
                return ['_fe-banner.php', 'banner.js', 'subfolder'];
            } else if (path.endsWith('/path/to/directory/subfolder')) {
                return ['file2.txt', '_fe-hero.php'];
            }
        });
        mockStatSync.mockImplementation((filePath: string) => {
            const fileName = filePath.split('/').pop() || '';
            if (fileName === '_fe-banner.php' || fileName === 'banner.js') {
                return { isDirectory: () => false, isFile: () => true };
            } else if (fileName === 'subfolder') {
                return { isDirectory: () => true, isFile: () => false };
            } else if (fileName === 'file2.txt' || fileName === '_fe-hero.php') {
                return { isDirectory: () => false, isFile: () => true };
            } else {
                throw new Error('Unexpected file path: ' + filePath);
            }
        });
        require('fs').readdirSync = mockReaddirSync;
        require('fs').statSync = mockStatSync;
        const dir = '/path/to/directory';
        const fileExtension = '.php';
        const fileStartWith = '_fe-';
        const result = getFiles(dir, fileExtension, fileStartWith);
        expect(result).toStrictEqual([
            '/path/to/directory/_fe-banner.php',
            '/path/to/directory/subfolder/_fe-hero.php',
        ]);
        expect(mockReaddirSync).toHaveBeenCalledTimes(2);
        expect(mockStatSync).toHaveBeenCalledTimes(5);
        expect(mockStatSync).toHaveBeenCalledWith('/path/to/directory/_fe-banner.php');
        expect(mockStatSync).toHaveBeenCalledWith('/path/to/directory/banner.js');
        expect(mockStatSync).toHaveBeenCalledWith('/path/to/directory/subfolder');
        expect(mockStatSync).toHaveBeenCalledWith('/path/to/directory/subfolder/file2.txt');
        expect(mockStatSync).toHaveBeenCalledWith('/path/to/directory/subfolder/_fe-hero.php');
    });
});
