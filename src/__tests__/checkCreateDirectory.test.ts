import { createDirectory } from '../util/createDirectory';
import * as fs from 'fs';
import { ROLL_BACK } from '../consts/rollBack';

jest.mock('fs');

describe('util/createDirectory - testing create directory', () => {
    beforeEach(() => {
        ROLL_BACK.directories = [];
    });

    it('should create a directory and add it to ROLL_BACK.directories', () => {
        const dirPath = '/path/to/directory';
        const mkdirSyncMock = jest.spyOn(fs, 'mkdirSync').mockImplementation(() => dirPath);

        createDirectory(dirPath);
        expect(mkdirSyncMock).toHaveBeenCalledWith(dirPath);
        expect(ROLL_BACK.directories).toContain(dirPath);
    });

    it('should throw an exception if directory creation fails', () => {
        const dirPath = '/path/to/directory';
        const errorMessage = 'Error creating directory';

        jest.spyOn(fs, 'mkdirSync').mockImplementation(() => {
            throw new Error(errorMessage);
        });

        expect(() => createDirectory(dirPath)).toThrowError(errorMessage);
        expect(ROLL_BACK.directories).toHaveLength(0);
    });
});
