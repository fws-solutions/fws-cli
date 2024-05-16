import { rollBack } from '../util/rollBack';
import { ROLL_BACK } from '../consts/rollBack';
import { getLogMessage } from '../util/getLogMessage';
import { getLogMessageInline } from '../util/getLogMessageInline';

jest.mock('../util/getLogMessage');
jest.mock('../util/getLogMessageInline');
jest.mock('fs');

describe('util/rollBack - testing rollback functionality', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should log an error message', () => {
        rollBack();

        expect(getLogMessage).toHaveBeenCalledWith('Something went wrong...', 'red');
    });

    it('should delete files and log messages', () => {
        ROLL_BACK.files = ['/path/to/file1.txt', '/path/to/file2.txt'];

        rollBack();

        expect(require('fs').unlinkSync).toHaveBeenNthCalledWith(1, '/path/to/file1.txt');
        expect(require('fs').unlinkSync).toHaveBeenNthCalledWith(2, '/path/to/file2.txt');

        expect(getLogMessageInline).toHaveBeenNthCalledWith(1, 'Deleted /path/to/file1.txt file!', 'yellow');
        expect(getLogMessageInline).toHaveBeenNthCalledWith(2, 'Deleted /path/to/file2.txt file!', 'yellow');
    });

    it('should delete directories and log messages', () => {
        ROLL_BACK.directories = ['/path/to/dir1', '/path/to/dir2'];

        rollBack();

        expect(require('fs').rmdirSync).toHaveBeenNthCalledWith(1, '/path/to/dir1');
        expect(require('fs').rmdirSync).toHaveBeenNthCalledWith(2, '/path/to/dir2');

        expect(getLogMessageInline).toHaveBeenNthCalledWith(3, 'Deleted /path/to/dir1 directory!', 'yellow');
        expect(getLogMessageInline).toHaveBeenNthCalledWith(4, 'Deleted /path/to/dir2 directory!', 'yellow');
    });
});
