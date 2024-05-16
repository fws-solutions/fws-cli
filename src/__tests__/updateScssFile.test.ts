import { updateScssFile } from '../util/updateScssFile';
import fs from 'fs';
import { resolve } from 'path';
import { getLogMessageInline } from '../util/getLogMessageInline';

jest.mock('fs');
jest.mock('../util/getLogMessageInline');

describe('util/updateScssFile - testing SCSS file updating', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should update the SCSS file correctly', () => {
        const projectRoot = '/path/to/project';
        const dirType = 'block';
        const fileName = 'hero';
        const existingContent = `/* Existing Content */\n`;
        const directoryPath = resolve(projectRoot, 'src/scss/layout');
        const path = 'src/scss/layout';
        const generateFile = `_${dirType}s.scss`;
        const filePath = resolve(directoryPath, generateFile);
        const content = `/* Existing Content */\n@import '../../../template-views/blocks/hero/hero';`;

        (fs.existsSync as jest.Mock).mockReturnValue(true);
        (fs.readFileSync as jest.Mock).mockReturnValue(existingContent);

        updateScssFile(projectRoot, dirType, fileName);

        expect(fs.writeFileSync).toHaveBeenCalledWith(filePath, content, 'utf8');
        expect(getLogMessageInline).toHaveBeenCalledWith(
            `Updated SCSS file: '${generateFile}' in dir '${path}'`,
            'cyan'
        );
    });

    it('should handle error and throw exception', () => {
        const errorMessage = 'Error writing file';
        jest.spyOn(fs, 'writeFileSync').mockImplementation(() => {
            throw new Error(errorMessage);
        });

        expect(() => updateScssFile('/path/to/project', 'block', 'hero')).toThrowError(errorMessage);
        expect(getLogMessageInline).not.toHaveBeenCalled();
    });
});
