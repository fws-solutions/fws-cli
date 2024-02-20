import { getAdditionalOptions } from '../util/getAdditionalOptions';
import { ICommand } from '../interfaces/interfaces';

describe('util/getAdditionalOptions - testing additional options', () => {
    it('should return correct options', () => {
        const mockCommand: ICommand = {
            name: 'test',
            description: 'test description',
            alias: 't',
            mandatoryOptions: [{ command: '-r, --required', description: 'required option' }],
            additionalOptions: [{ command: '-a, --additional', description: 'additional option' }],
            run: () => {},
        };
        const result = getAdditionalOptions(mockCommand);
        expect(result).toEqual([{ command: '-a, --additional', description: 'additional option' }]);
    });
    it('should return empty array if no additional options', () => {
        const mockCommand: ICommand = {
            name: 'test',
            description: 'test description',
            alias: 't',
            mandatoryOptions: [{ command: '-r, --required', description: 'required option' }],
            run: () => {},
        };
        const result = getAdditionalOptions(mockCommand);
        expect(result).toEqual([]);
    });
});
