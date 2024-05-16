import { unlinkSync, existsSync } from 'fs';
import { getLogMessageInline } from './getLogMessageInline';

export const deleteDuplicateIcon = (filePath: string): void => {
    if (existsSync(filePath)) {
        try {
            unlinkSync(filePath);
            getLogMessageInline(`Deleted '${filePath}' as file with the same name already exists!`, 'yellow');
        } catch (error) {
            if (error instanceof Error) {
                getLogMessageInline(`Something went wrong during delete '${filePath}!'`, 'red');
            }
        }
    }
};
