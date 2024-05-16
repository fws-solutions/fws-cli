import { getLogMessage } from '../util/getLogMessage';
import _template from 'lodash.template';
import * as fsModule from 'fs';

jest.mock('fancy-log');
jest.mock('ansi-colors', () => ({
    red: jest.fn((text: string) => text),
}));
jest.mock('lodash.template');
jest.mock('fs', () => ({
    ...jest.requireActual('fs'),
    readFileSync: jest.fn(),
}));

describe('util/getLogMessage - testing log message', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should log a red message', () => {
        const mockTemplate = _template as jest.Mock;
        mockTemplate.mockReturnValue(jest.fn());
        (fsModule.readFileSync as jest.Mock).mockReturnValue('Template content');
        getLogMessage('Error message', 'red');

        expect(fsModule.readFileSync).toHaveBeenCalledWith(expect.any(String), 'utf8');
    });
});
