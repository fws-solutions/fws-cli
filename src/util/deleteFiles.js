import { getLogMessage } from './getLogMessage.js';
import { unlinkSync } from 'fs';
import colors from 'ansi-colors';

export const deleteFiles = (filePaths, noFilesToDeleteMsg, deleteMsg) => {
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
