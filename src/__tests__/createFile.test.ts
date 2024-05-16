import { createFile } from '../util/createFile';
import { writeFileSync } from 'fs';
import { compileTemplate } from '../util/compileTemplate';
import { getLogMessageInline } from '../util/getLogMessageInline';
import { ROLL_BACK } from '../consts/rollBack';
import { resolve } from 'path';

jest.mock('fs');
jest.mock('../util/compileTemplate');
jest.mock('../util/getLogMessageInline');

describe('util/createFile - testing file creation', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should create a file correctly and update ROLL_BACK', () => {
        const dirName = 'hero';
        const dirType = 'part';
        const tempName = 'php-fe';
        const prefix = '_fe-';
        const extension = 'php';
        const dirPath = '/path/to/project/template-views/parts/hero';

        (compileTemplate as jest.Mock).mockReturnValue('Content of the file');

        const fileName = '_fe-hero.php';
        const writeDir = resolve(dirPath, fileName);

        createFile(dirName, dirType, tempName, prefix, extension, dirPath);

        expect(writeFileSync).toHaveBeenCalledWith(writeDir, 'Content of the file', 'utf8');

        expect(ROLL_BACK.files).toContain(writeDir);

        expect(getLogMessageInline).toHaveBeenCalledWith(
            `Created PHP file: '_fe-hero.php' in dir template-views/parts/hero'`,
            'cyan'
        );
    });

    it('should handle error and throw exception', () => {
        (writeFileSync as jest.Mock).mockImplementation(() => {
            throw new Error('Error writing file');
        });

        expect(() => createFile('hero', 'part', 'php', '', 'php', '/path/to/project/template-views')).toThrowError(
            'Error writing file'
        );

        expect(ROLL_BACK.files).toHaveLength(1);

        expect(getLogMessageInline).not.toHaveBeenCalled();
    });
});
