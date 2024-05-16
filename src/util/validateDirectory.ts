import { existsSync } from 'fs';
import { getLogMessage } from './getLogMessage';

export const validateDirectory = (dirPath: string, errorMsg: string): void => {
    if (existsSync(dirPath)) {
        getLogMessage(errorMsg, 'red');
        process.exit(1);
    }
};
