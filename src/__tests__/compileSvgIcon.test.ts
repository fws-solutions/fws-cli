import { compileSvgIcons } from '../util/compileSvgIcons';
import { readdirSync } from 'fs';

jest.mock('fs');

describe('util/compileSvgIcons - testing compile svg icons', () => {
    const compiledImportSrc = 'path/to/compiled/icons';
    const svgDirPath = 'path/to/svg/icons';

    it('should compile import and component strings for SVG icons', () => {
        const mockReaddirSync = jest.fn().mockReturnValue(['ico-first.svg', 'ico-second.svg']);
        (readdirSync as jest.Mock) = mockReaddirSync;

        const result = compileSvgIcons(compiledImportSrc, svgDirPath);

        expect(mockReaddirSync).toHaveBeenCalledWith(svgDirPath);
        expect(result.impStrings).toContain("import First from 'path/to/compiled/icons';");
        expect(result.impStrings).toContain("import Second from 'path/to/compiled/icons';");
        expect(result.compStrings).toContain('First,');
        expect(result.compStrings).toContain('Second,');
    });

    it('should handle empty directory gracefully', () => {
        const mockReaddirSync = jest.fn().mockReturnValue([]);
        (readdirSync as jest.Mock) = mockReaddirSync;

        const result = compileSvgIcons(compiledImportSrc, svgDirPath);

        expect(mockReaddirSync).toHaveBeenCalledWith(svgDirPath);
        expect(result.impStrings).toBe('');
        expect(result.compStrings).toBe('');
    });
});
