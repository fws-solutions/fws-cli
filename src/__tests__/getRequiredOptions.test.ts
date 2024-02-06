import { getRequiredOptions } from '../util/getRequiredOptions';
import { ICommand } from '../interfaces/interfaces';

describe('util/getRequiredOptions - testing required options', () => {
    it('should return correct options', () => {
        const mockCommand: ICommand = {
            name: 'test',
            description: 'test description',
            alias: 't',
            mandatoryOptions: [{ command: '-r, --required', description: 'required option' }],
            additionalOptions: [{ command: '-a, --additional', description: 'additional option' }],
            run: () => {},
        };
        const result = getRequiredOptions(mockCommand);
        expect(result).toEqual([{ command: '-r, --required', description: 'required option' }]);
    });
});
