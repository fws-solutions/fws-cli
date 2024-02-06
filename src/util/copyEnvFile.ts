import { existsSync, copyFileSync } from 'fs';
import { getLogMessage } from './getLogMessage';

export const copyEnvFile = (template: string, envPath: string, message: string, fileName: string) => {
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
