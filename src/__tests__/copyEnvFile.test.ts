import { copyEnvFile } from '../util/copyEnvFile';
import * as fs from 'fs';
import { getLogMessage } from '../util/getLogMessage';

jest.mock('fs');

jest.mock('../util/getLogMessage', () => ({
    getLogMessage: jest.fn().mockImplementation((_message, _color) => {}),
}));

describe('util/copyEnvFile - testing copy env file', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should copy the file and log a message when the file does not exist', () => {
        const template = 'template.txt';
        const envPath = 'env.txt';
        const message = 'environment';
        const fileName = 'env.txt';

        jest.spyOn(fs, 'existsSync').mockReturnValueOnce(false);
        jest.spyOn(fs, 'copyFileSync');

        copyEnvFile(template, envPath, message, fileName);

        expect(fs.existsSync).toHaveBeenCalledWith(envPath);
        expect(fs.copyFileSync).toHaveBeenCalledWith(template, envPath);
        expect(getLogMessage).toHaveBeenCalledWith(
            `Generated '${fileName}' file in the root of the ${message}`,
            'cyan'
        );
    });

    it('should log a warning message when the file already exists', () => {
        const template = 'template.txt';
        const envPath = 'env.txt';
        const message = 'environment';
        const fileName = 'env.txt';

        jest.spyOn(fs, 'existsSync').mockReturnValueOnce(true);
        copyEnvFile(template, envPath, message, fileName);

        expect(fs.existsSync).toHaveBeenCalledWith(envPath);
        expect(getLogMessage).toHaveBeenCalledWith(`WARNING: '${fileName}' already exists!`, 'yellow');
    });

    it('should log an error message when an exception occurs during copying', () => {
        const template = 'template.txt';
        const envPath = 'env.txt';
        const message = 'environment';
        const fileName = 'env.txt';

        jest.spyOn(fs, 'existsSync').mockReturnValueOnce(false);
        jest.spyOn(fs, 'copyFileSync').mockImplementation(() => {
            throw new Error('Error copying file');
        });

        const consoleLogMock = jest.spyOn(console, 'log').mockImplementation(() => {});

        copyEnvFile(template, envPath, message, fileName);

        expect(fs.existsSync).toHaveBeenCalledWith(envPath);
        expect(consoleLogMock).toHaveBeenCalledWith(expect.any(Error));
    });

    it('should not log a message when file copying is successful', () => {
        const template = 'template.txt';
        const envPath = 'env.txt';
        const message = 'environment';
        const fileName = 'env.txt';

        jest.spyOn(fs, 'existsSync').mockReturnValueOnce(false);
        jest.spyOn(fs, 'copyFileSync');

        copyEnvFile(template, envPath, message, fileName);

        expect(getLogMessage).not.toHaveBeenCalled();
    });
});
