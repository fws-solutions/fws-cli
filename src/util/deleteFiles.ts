import { getLogMessage } from './getLogMessage';
import { unlinkSync } from 'fs';
import colors from 'ansi-colors';

export const deleteFiles = (filePaths: Array<string>, noFilesToDeleteMsg: string, deleteMsg: string): void => {
    let count = 1;

    if (!filePaths.length) {
        getLogMessage(noFilesToDeleteMsg, 'cyan');
        return;
    }
    getLogMessage(deleteMsg, 'red');

    filePaths.forEach((filePath) => {
        try {
            unlinkSync(filePath);
            console.log(colors.red(` ${count++}. ${filePath}`));
        } catch (exception) {
            console.log(exception);
        }
    });
};
