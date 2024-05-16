import { lstatSync, unlinkSync, rmdir } from 'fs';
import { relative } from 'path';
import { getLogMessageInline } from '../util/getLogMessageInline';
import { removeNonSvgFiles } from '../util/removeNonSvgFiles';

jest.mock('fs');
jest.mock('path', () => ({
    relative: jest.fn(),
}));
jest.mock('../util/getLogMessageInline');

describe('util/removeNonSvgFiles', () => {
    const svgDirPath = '/path/to/svg';
    const filePath = '/path/to/svg/file.txt';
    const relativePath = 'file.txt';

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should delete a non-svg file and log a message', () => {
        (lstatSync as jest.Mock).mockReturnValue({ isDirectory: jest.fn().mockReturnValue(false) });
        (relative as jest.Mock).mockReturnValue(relativePath);

        removeNonSvgFiles(filePath, svgDirPath);

        expect(lstatSync).toHaveBeenCalledWith(filePath);
        expect(unlinkSync).toHaveBeenCalledWith(filePath);
        expect(getLogMessageInline).toHaveBeenCalledWith(
            `Deleted '${relativePath}' as it is not an SVG file!`,
            'yellow'
        );
    });

    it('should delete a directory and log a message', () => {
        const rmdirCallback = jest.fn((_, callback) => callback(null));
        (lstatSync as jest.Mock).mockReturnValue({ isDirectory: jest.fn().mockReturnValue(true) });
        (relative as jest.Mock).mockReturnValue(relativePath);
        (rmdir as unknown as jest.Mock).mockImplementation(rmdirCallback);

        removeNonSvgFiles(filePath, svgDirPath);

        expect(lstatSync).toHaveBeenCalledWith(filePath);
        expect(rmdir).toHaveBeenCalledWith(filePath, expect.any(Function));
        expect(rmdirCallback).toHaveBeenCalled();
        expect(getLogMessageInline).toHaveBeenCalledWith(
            `Deleted '${relativePath}' as it is not an SVG file!`,
            'yellow'
        );
    });

    it('should log an error if rmdir fails', () => {
        const error = new Error('Test error');
        const rmdirCallback = jest.fn((_, callback) => callback(error));
        (lstatSync as jest.Mock).mockReturnValue({ isDirectory: jest.fn().mockReturnValue(true) });
        (relative as jest.Mock).mockReturnValue(relativePath);
        (rmdir as unknown as jest.Mock).mockImplementation(rmdirCallback);
        console.log = jest.fn();

        removeNonSvgFiles(filePath, svgDirPath);

        expect(lstatSync).toHaveBeenCalledWith(filePath);
        expect(rmdir).toHaveBeenCalledWith(filePath, expect.any(Function));
        expect(console.log).toHaveBeenCalledWith(error);
    });

    it('should log an error if lstatSync fails', () => {
        const error = new Error('Test error');
        (lstatSync as jest.Mock).mockImplementation(() => {
            throw error;
        });
        console.log = jest.fn();

        removeNonSvgFiles(filePath, svgDirPath);

        expect(lstatSync).toHaveBeenCalledWith(filePath);
        expect(console.log).toHaveBeenCalledWith(error);
    });
});
