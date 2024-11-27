import * as fsModule from 'fs';
import * as pathModule from 'path';
import _ from 'lodash';
import * as getLogMessageInlineModule from '../util/getLogMessageInline';
import * as prepareIconsScssFileModule from '../util/prepareIconsScssFile';
import { generateIconsScssFile } from '../util/generateIconsScssFile';

jest.mock('fs');
jest.mock('path');
jest.mock('../util/getLogMessageInline');
jest.mock('../util/prepareIconsScssFile');

describe('util/generateIconsScssFile - testing generate icons scss file', () => {
    const projectRoot = '/your/project/root';
    const appRoot = '/your/app/root';
    const svgDirPath = '/path/to/svg/dir';

    it('should generate _icons.scss file and log a message', () => {
        const mockWriteFileSync = jest.spyOn(fsModule, 'writeFileSync');
        const mockReadFileSync = jest.spyOn(fsModule, 'readFileSync').mockReturnValue('templateContent');
        const mockResolve = jest.spyOn(pathModule, 'resolve').mockReturnValue('/resolved/path');
        const mockTemplateExecutor: _.TemplateExecutor = {
            source: 'compiledTemplateResult',
        } as _.TemplateExecutor;

        jest.spyOn(_, 'template').mockReturnValue(mockTemplateExecutor);

        const mockGetLogMessageInline = jest.spyOn(getLogMessageInlineModule, 'getLogMessageInline');
        const mockPrepareIconsScssFile = jest
            .spyOn(prepareIconsScssFileModule, 'prepareIconsScssFile')
            .mockReturnValue('scssImports');

        generateIconsScssFile(projectRoot, appRoot, svgDirPath);

        expect(mockResolve).toHaveBeenCalledWith(appRoot, 'src/templates/other/temp-svg-gen-scss.txt');
        expect(mockReadFileSync).toHaveBeenCalledWith('/resolved/path', 'utf8');
        expect(mockPrepareIconsScssFile).toHaveBeenCalledWith(svgDirPath);
        expect(mockWriteFileSync).toHaveBeenCalledWith('/resolved/path', 'templateContent', 'utf8');
        expect(mockGetLogMessageInline).toHaveBeenCalledWith('_icons.scss is generated!', 'cyan');
    });

    it('should catch and log an exception', () => {
        const mockReadFileSync = jest.spyOn(fsModule, 'readFileSync').mockReturnValue('templateContent');
        const mockResolve = jest.spyOn(pathModule, 'resolve').mockReturnValue('/resolved/path');
        const mockConsoleLog = jest.spyOn(console, 'log');
        try {
            const mockWriteFileSync = jest.spyOn(fsModule, 'writeFileSync');

            mockWriteFileSync.mockImplementation(() => {
                throw new Error('Mocked writeFileSync error');
            });

            generateIconsScssFile(projectRoot, appRoot, svgDirPath);
        } catch (err) {
            expect(mockResolve).toHaveBeenCalledWith(appRoot, 'src/templates/other/temp-svg-gen-scss.txt');
            expect(mockReadFileSync).toHaveBeenCalledWith('/resolved/path', 'utf8');
            expect(mockConsoleLog).toHaveBeenCalledWith(expect.any(Error));
        }
    });
});
