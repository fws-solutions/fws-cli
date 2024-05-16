import { deleteDuplicateIcon } from '../util/deleteDuplicateIcon';
import { getLogMessageInline } from '../util/getLogMessageInline';
import { unlinkSync } from 'fs';

jest.mock('fs');
jest.mock('../util/getLogMessageInline');

describe('util/deleteDuplicateIcon - testing delete duplicate icon', () => {
    const filePath = '/path/to/svg/icon.svg';

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('should delete the file if it exists and log a message', () => {
        jest.spyOn(require('fs'), 'existsSync').mockReturnValue(true);

        deleteDuplicateIcon(filePath);

        expect(unlinkSync).toHaveBeenCalledWith(filePath);
        expect(getLogMessageInline).toHaveBeenCalledWith(
            `Deleted '${filePath}' as file with the same name already exists!`,
            'yellow'
        );
    });
    it('should handle errors during deletion and log an error message', () => {
        jest.spyOn(require('fs'), 'existsSync').mockReturnValue(true);
        jest.spyOn(require('fs'), 'unlinkSync').mockImplementation(() => {
            throw new Error('Error during unlink');
        });

        deleteDuplicateIcon(filePath);
        expect(getLogMessageInline).toHaveBeenCalledWith(`Something went wrong during delete '${filePath}!'`, 'red');
    });
});
