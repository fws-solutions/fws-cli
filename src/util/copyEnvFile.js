import { existsSync, copyFileSync } from 'fs';
import { getLogMessage } from './getLogMessage.js';

export const copyEnvFile = (template, envPath, message, fileName) => {
    if (!existsSync(envPath)) {
        try {
            copyFileSync(template, envPath);
            getLogMessage(`Generated '${fileName}' file in the root of the ${message}`, 'cyan');
        } catch (exception) {
            console.log(exception);
        }
    } else {
        getLogMessage(`WARNING: '${fileName}' already exists!`, 'yellow');
    }
};
