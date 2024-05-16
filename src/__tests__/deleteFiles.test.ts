import { deleteFiles } from '../util/deleteFiles';
import { unlinkSync } from 'fs';
import { getLogMessage } from '../util/getLogMessage';

jest.mock('fs');
jest.mock('../util/getLogMessage');
jest.mock('ansi-colors');

describe('util/deleteFiles - testing delete files', () => {
    const filePaths = ['/path/to/file1', '/path/to/file2'];
    const noFilesToDeleteMsg = 'No files to delete';
    const deleteMsg = 'Deleting files';

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should log a message if there are no files to delete', () => {
        deleteFiles([], noFilesToDeleteMsg, deleteMsg);

        expect(getLogMessage).toHaveBeenCalledWith(noFilesToDeleteMsg, 'cyan');
        expect(unlinkSync).not.toHaveBeenCalled();
    });

    it('should delete files and log messages', () => {
        jest.spyOn(console, 'log').mockImplementation(() => {});

        deleteFiles(filePaths, noFilesToDeleteMsg, deleteMsg);

        expect(getLogMessage).toHaveBeenCalledWith(deleteMsg, 'red');
        expect(unlinkSync).toHaveBeenCalledTimes(2);
    });

    it('should handle errors during file deletion and log them', () => {
        jest.spyOn(console, 'log').mockImplementation(() => {});
        jest.spyOn(require('fs'), 'unlinkSync').mockImplementation(() => {
            throw new Error('Mocked error during unlink');
        });

        deleteFiles(filePaths, noFilesToDeleteMsg, deleteMsg);

        expect(getLogMessage).toHaveBeenCalledWith(deleteMsg, 'red');
        expect(unlinkSync).toHaveBeenCalledTimes(2);
    });
});
