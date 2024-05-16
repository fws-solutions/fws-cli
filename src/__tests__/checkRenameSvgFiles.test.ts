import { renameSvgFiles } from '../util/renameSvgFiles';

describe('util/renameSvgFiles - testing rename svg files', () => {
    const svgDirPath = '/path/to/svg/dir';

    it('should rename SVG files with the correct prefix and format', () => {
        const filePath = '/path/to/svg/dir/original-file.svg';
        const file = 'original-file.svg';

        const result = renameSvgFiles(svgDirPath, filePath, file);

        expect(result).toBe('/path/to/svg/dir/ico-original-file.svg');
    });

    it('should handle file names with spaces, special characters, and multiple dashes', () => {
        const filePath = '/path/to/svg/dir/old-file.svg';
        const file = 'Old! - File.svg';

        const result = renameSvgFiles(svgDirPath, filePath, file);

        expect(result).toBe('/path/to/svg/dir/ico-old-file.svg');
    });

    it('should not rename files starting with "ico-"', () => {
        const filePath = '/path/to/svg/dir/ico-existing-file.svg';
        const file = 'ico-existing-file.svg';

        const result = renameSvgFiles(svgDirPath, filePath, file);

        expect(result).toBe(filePath);
    });
});
