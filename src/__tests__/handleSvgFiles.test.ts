import { handleSvgFiles } from '../util/handleSvgFiles';
import { readdirSync } from 'fs';
import { handleSvgFile } from '../util/handleSvgFile';

jest.mock('fs');
jest.mock('../util/handleSvgFile');

describe('util/handleSvgFiles - testing handle svg files', () => {
    it('should call handleSvgFile for each file in the directory', () => {
        const svgDirPath = '/path/to/svg/directory';
        const mockFiles = ['file1.svg', 'file2.svg', 'file3.svg'];

        (readdirSync as jest.Mock).mockReturnValue(mockFiles);

        handleSvgFiles(svgDirPath);

        expect(handleSvgFile).toHaveBeenCalledTimes(mockFiles.length);

        mockFiles.forEach((file) => {
            expect(handleSvgFile).toHaveBeenCalledWith(svgDirPath, file);
        });
    });
});
