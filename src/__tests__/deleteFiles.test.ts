describe('ToDo - implement delete files test', () => {
    it('should be implemented', () => {
        expect(true).toBe(true);
    });
});

// import { deleteFiles } from '../util/deleteFiles';
// import { getLogMessage } from '../util/getLogMessage';
// import { unlinkSync } from 'fs';

// jest.mock('../util/getLogMessage', () => ({
//     getLogMessage: jest.fn(),
// }));

// jest.mock('fs', () => ({
//     unlinkSync: jest.fn(),
// }));

// describe('util/deleteFiles - testing delete files', () => {
//     afterEach(() => {
//         jest.clearAllMocks();
//     });

//     it('should log message for no files to delete if filePaths is empty', () => {
//         const noFilesToDeleteMsg = 'No files to delete';
//         deleteFiles([], noFilesToDeleteMsg, 'Delete message');
//         expect(getLogMessage).toHaveBeenCalledWith(noFilesToDeleteMsg, 'cyan');
//         expect(unlinkSync).not.toHaveBeenCalled();
//     });

//     it('should log delete message and delete files', () => {
//         const filePaths = ['/path/to/file1.txt', '/path/to/file2.txt'];
//         const deleteMsg = 'Deleting files';

//         (unlinkSync as jest.Mock).mockImplementation(() => {});

//         deleteFiles(filePaths, 'No files to delete', deleteMsg);

//         expect(getLogMessage).toHaveBeenCalledWith(deleteMsg, 'red');
//         expect(unlinkSync).toHaveBeenCalledTimes(filePaths.length);
//         filePaths.forEach((filePath, index) => {
//             expect(unlinkSync).toHaveBeenCalledWith(filePath);
//             expect(jest.spyOn).toHaveBeenCalledWith(expect.stringContaining(filePath));
//             expect(console.log).toHaveBeenCalledWith(expect.stringContaining(`${index + 1}.`));
//         });
//     });

//     test('should log errors if unlinkSync throws an exception', () => {
//         const filePaths = ['/path/to/invalidfile.txt'];
//         const deleteMsg = 'Deleting files';
//         const errorMessage = 'Failed to delete file';

//         (unlinkSync as jest.Mock).mockImplementation(() => {
//             throw new Error(errorMessage);
//         });

//         deleteFiles(filePaths, 'No files to delete', deleteMsg);

//         expect(getLogMessage).toHaveBeenCalledWith(deleteMsg, 'red');
//         expect(unlinkSync).toHaveBeenCalledTimes(filePaths.length);
//         expect(console.log).toHaveBeenCalledWith(expect.stringContaining(errorMessage));
//     });
// });
