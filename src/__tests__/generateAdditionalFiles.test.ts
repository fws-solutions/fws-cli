import * as getSvgIconDataModule from '../util/getSvgIconData';
import * as compileSvgIconsModule from '../util/compileSvgIcons';
import * as readFileSyncModule from 'fs';
import * as writeFileSyncModule from 'fs';
import * as getLogMessageInlineModule from '../util/getLogMessageInline';
import { generateAdditionalFiles } from '../util/generateAdditionalFiles';
import { resolve } from 'path';

jest.mock('fs');

describe('util/generateAdditionalFiles - testing generate additional files', () => {
    const appRoot = '/path/to/app/root';
    const projectRoot = '/path/to/project/root';
    const svgDirPath = '/path/to/svg/icons';
    const packageType = 'somePackageType';

    it('should generate SvgIconGen.vue file', () => {
        const mockGetSvgIconData = jest.spyOn(getSvgIconDataModule, 'getSvgIconData').mockReturnValue({
            compiledImportSrc: 'path/to/compiled/icons',
            templateFile: 'SvgIconGenTemplate.vue.ejs',
            svgIconFile: 'SvgIconGen.vue',
        });

        const mockCompileSvgIcons = jest.spyOn(compileSvgIconsModule, 'compileSvgIcons').mockReturnValue({
            impStrings: "import First from 'path/to/compiled/icons';",
            compStrings: 'First,',
        });

        const mockReadFileSync = jest
            .spyOn(readFileSyncModule, 'readFileSync')
            .mockReturnValue('<%= imports %><%= components %>');

        const mockWriteFileSync = jest.spyOn(writeFileSyncModule, 'writeFileSync');
        const mockGetLogMessageInline = jest.spyOn(getLogMessageInlineModule, 'getLogMessageInline');

        generateAdditionalFiles(appRoot, projectRoot, svgDirPath, packageType);

        expect(mockGetSvgIconData).toHaveBeenCalledWith(projectRoot, packageType);
        expect(mockCompileSvgIcons).toHaveBeenCalledWith('path/to/compiled/icons', '/path/to/svg/icons');
        expect(mockReadFileSync).toHaveBeenCalledWith(
            resolve(appRoot, 'src/templates/other', 'SvgIconGenTemplate.vue.ejs'),
            'utf8'
        );
        expect(mockWriteFileSync).toHaveBeenCalledWith(
            'SvgIconGen.vue',
            "import First from 'path/to/compiled/icons';First,",
            'utf8'
        );
        expect(mockGetLogMessageInline).toHaveBeenCalledWith('SvgIconGen.vue file is generated!', 'cyan');
    });
    it('should log an error if writeFileSync fails', () => {
        const mockGetSvgIconData = jest.spyOn(getSvgIconDataModule, 'getSvgIconData').mockReturnValue({
            compiledImportSrc: 'path/to/compiled/icons',
            templateFile: 'SvgIconGenTemplate.vue.ejs',
            svgIconFile: 'SvgIconGen.vue',
        });

        const mockCompileSvgIcons = jest.spyOn(compileSvgIconsModule, 'compileSvgIcons').mockReturnValue({
            impStrings: "import First from 'path/to/compiled/icons';",
            compStrings: 'First,',
        });

        const mockReadFileSync = jest
            .spyOn(readFileSyncModule, 'readFileSync')
            .mockReturnValue('<%= imports %><%= components %>');

        const mockWriteFileSync = jest.spyOn(writeFileSyncModule, 'writeFileSync').mockImplementation(() => {
            throw new Error('Mocked error during writeFileSync');
        });

        const mockGetLogMessageInline = jest.spyOn(getLogMessageInlineModule, 'getLogMessageInline');

        generateAdditionalFiles(appRoot, projectRoot, svgDirPath, packageType);

        expect(mockGetSvgIconData).toHaveBeenCalledWith(projectRoot, packageType);
        expect(mockCompileSvgIcons).toHaveBeenCalledWith('path/to/compiled/icons', '/path/to/svg/icons');
        expect(mockReadFileSync).toHaveBeenCalledWith(
            resolve(appRoot, 'src/templates/other', 'SvgIconGenTemplate.vue.ejs'),
            'utf8'
        );
        expect(mockWriteFileSync).toHaveBeenCalledWith(
            'SvgIconGen.vue',
            "import First from 'path/to/compiled/icons';First,",
            'utf8'
        );
        expect(mockGetLogMessageInline).toHaveBeenCalledWith('Mocked error during writeFileSync', 'red');
    });
});
