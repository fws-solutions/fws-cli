import { getLogMessageInline } from '../util/getLogMessageInline';
import fancyLog from 'fancy-log';
import colors from 'ansi-colors';

jest.mock('fancy-log');

describe('util/getLogMessageInline - testing inline log message', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should log a red message', () => {
        const mockColors = jest.spyOn(colors, 'red').mockReturnValue('Red message');
        getLogMessageInline('Error message', 'red');

        expect(mockColors).toHaveBeenCalledWith('Error message');
        expect(fancyLog).toHaveBeenCalledWith('Red message');
    });

    it('should log a yellow message', () => {
        const mockColors = jest.spyOn(colors, 'yellow').mockReturnValue('Yellow message');
        getLogMessageInline('Warning message', 'yellow');

        expect(mockColors).toHaveBeenCalledWith('Warning message');
        expect(fancyLog).toHaveBeenCalledWith('Yellow message');
    });

    it('should log a cyan message', () => {
        const mockColors = jest.spyOn(colors, 'cyan').mockReturnValue('Cyan message');
        getLogMessageInline('Success message', 'cyan');

        expect(mockColors).toHaveBeenCalledWith('Success message');
        expect(fancyLog).toHaveBeenCalledWith('Cyan message');
    });
});
