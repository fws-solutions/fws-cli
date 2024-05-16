import { readFileSync, writeFileSync, existsSync, unlinkSync } from 'fs';
import { resolve, extname } from 'path';
import { getLogMessageInline } from '../util/getLogMessageInline';
import { removeNonSvgFiles } from '../util/removeNonSvgFiles';
import { optimize } from 'svgo';
import { renameSvgFiles } from '../util/renameSvgFiles';
import { deleteDuplicateIcon } from '../util/deleteDuplicateIcon';
import { handleSvgFile } from '../util/handleSvgFile';

// Mocking the imported functions and file system operations
jest.mock('fs');
jest.mock('path');
jest.mock('../util/getLogMessageInline');
jest.mock('../util/removeNonSvgFiles');
jest.mock('svgo');
jest.mock('../util/renameSvgFiles');
jest.mock('../util/deleteDuplicateIcon');

describe('util/handleSvgFile', () => {
    const svgDirPath = '/path/to/svg';
    const nonSvgFile = 'test.txt';
    const svgFile = 'test.svg';
    const icoFile = 'ico-test.svg';
    const filePath = resolve(svgDirPath, nonSvgFile);
    const svgFilePath = resolve(svgDirPath, svgFile);
    const icoFilePath = resolve(svgDirPath, icoFile);

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should remove non-svg files', () => {
        (extname as jest.Mock).mockReturnValue('.txt');
        (resolve as jest.Mock).mockReturnValue(filePath);

        handleSvgFile(svgDirPath, nonSvgFile);

        expect(removeNonSvgFiles).toHaveBeenCalledWith(filePath, svgDirPath);
    });

    it('should handle svg optimization and renaming', () => {
        (extname as jest.Mock).mockReturnValue('.svg');
        (resolve as jest.Mock).mockReturnValue(svgFilePath);
        (readFileSync as jest.Mock).mockReturnValue('<svg></svg>');
        (optimize as jest.Mock).mockReturnValue({ data: '<svg></svg>' });
        (renameSvgFiles as jest.Mock).mockReturnValue(svgFilePath);
        (existsSync as jest.Mock).mockReturnValue(false);

        handleSvgFile(svgDirPath, svgFile);

        expect(readFileSync).toHaveBeenCalledWith(svgFilePath, { encoding: 'utf8', flag: 'r' });
        expect(optimize).toHaveBeenCalledWith('<svg></svg>');
        expect(renameSvgFiles).toHaveBeenCalledWith(svgDirPath, svgFilePath, svgFile);
        expect(writeFileSync).toHaveBeenCalledWith(svgFilePath, '<svg></svg>', { encoding: 'utf8', flag: 'w' });
        expect(getLogMessageInline).not.toHaveBeenCalled();
    });

    it('should delete duplicate icon and remove original file for ico- files', () => {
        (extname as jest.Mock).mockReturnValue('.svg');
        (resolve as jest.Mock).mockReturnValue(icoFilePath);
        (readFileSync as jest.Mock).mockReturnValue('<svg></svg>');
        (optimize as jest.Mock).mockReturnValue({ data: '<svg></svg>' });
        (renameSvgFiles as jest.Mock).mockReturnValue(icoFilePath);
        (existsSync as jest.Mock).mockReturnValue(false);

        handleSvgFile(svgDirPath, icoFile);

        expect(deleteDuplicateIcon).toHaveBeenCalledWith(icoFilePath);
        expect(unlinkSync).toHaveBeenCalledWith(icoFilePath);
    });

    it('should log a message if the file still exists after optimization', () => {
        (extname as jest.Mock).mockReturnValue('.svg');
        (resolve as jest.Mock).mockReturnValue(svgFilePath);
        (readFileSync as jest.Mock).mockReturnValue('<svg></svg>');
        (optimize as jest.Mock).mockReturnValue({ data: '<svg></svg>' });
        (renameSvgFiles as jest.Mock).mockReturnValue(svgFilePath);
        (existsSync as jest.Mock).mockReturnValue(true);

        handleSvgFile(svgDirPath, svgFile);

        expect(getLogMessageInline).toHaveBeenCalledWith(`Optimized ${svgFile}`, 'cyan');
    });

    it('should catch and log errors during non-svg file removal', () => {
        const error = new Error('Test error');
        (extname as jest.Mock).mockReturnValue('.txt');
        (resolve as jest.Mock).mockReturnValue(filePath);
        (removeNonSvgFiles as jest.Mock).mockImplementation(() => {
            throw error;
        });
        console.log = jest.fn();

        handleSvgFile(svgDirPath, nonSvgFile);

        expect(console.log).toHaveBeenCalledWith(error);
    });

    it('should catch and log errors during svg optimization and renaming', () => {
        const error = new Error('Test error');
        (extname as jest.Mock).mockReturnValue('.svg');
        (resolve as jest.Mock).mockReturnValue(svgFilePath);
        (readFileSync as jest.Mock).mockImplementation(() => {
            throw error;
        });
        console.error = jest.fn();

        handleSvgFile(svgDirPath, svgFile);

        expect(console.error).toHaveBeenCalledWith(`Error processing ${svgFile}:`, error);
    });
});
