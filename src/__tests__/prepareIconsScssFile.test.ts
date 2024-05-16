import { prepareIconsScssFile } from '../util/prepareIconsScssFile';

jest.mock('fs');

describe('util/prepareIconsScssFile - testing prepare icons scss file', () => {
    const svgDirPath = '/path/to/svg/dir';

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('should generate SCSS imports for each SVG file in the directory', () => {
        jest.spyOn(require('fs'), 'readdirSync').mockReturnValue(['icon1.svg', 'icon2.svg']);

        const result = prepareIconsScssFile(svgDirPath);

        expect(result).toContain(`@if $icon == icon1`);
        expect(result).toContain(`@if $icon == icon2`);
    });

    it('should handle an empty directory and return an empty string', () => {
        jest.spyOn(require('fs'), 'readdirSync').mockReturnValue([]);

        const result = prepareIconsScssFile(svgDirPath);

        expect(result).toBe('');
    });

    it('should handle SVG files with spaces in names', () => {
        jest.spyOn(require('fs'), 'readdirSync').mockReturnValue(['icon with spaces.svg', 'icon3.svg']);

        const result = prepareIconsScssFile(svgDirPath);

        expect(result).toContain(`@if $icon == icon with spaces`);
        expect(result).toContain(`@if $icon == icon3`);
    });
});
