import { IOption } from '../interfaces/interfaces';
import { checkIfOneOptionIsPresent } from '../util/checkIfOneOptionIsPresent';

const mockOptions: Array<IOption> = [
    { command: '-p', description: 'mock desc' },
    { command: '-q', description: 'mock desc' },
    { command: '-z', description: 'mock desc' },
];
const mockGoodArgs: Array<boolean> = [false, false, true];
const mockBadArgs: Array<boolean> = [false, false, false];
const mockBadArgs2: Array<boolean> = [true, true, true];
describe('util/checkIfOneOptionIsPresent - testing multiple optional options where 1 is mandatory', () => {
    it(`it shouldn't be able to parse invalid options`, () => {
        const { message, shouldExit } = checkIfOneOptionIsPresent([], mockGoodArgs);
        expect(message).toBe('Error parsing options');
        expect(shouldExit).toBe(true);
    });
    it('should return {message: string, shouldExit: false} when args have exactly 1 positive', () => {
        const { message, shouldExit } = checkIfOneOptionIsPresent(mockOptions, mockGoodArgs);
        expect(message).toBe('');
        expect(shouldExit).toBe(false);
    });
    it('should return {message: string, shouldExit: true} when args have no positives', () => {
        const { message, shouldExit } = checkIfOneOptionIsPresent(mockOptions, mockBadArgs);
        expect(message).toBe('Please specify exactly one of the options: -p, -q, -z');
        expect(shouldExit).toBe(true);
    });
    it('should return {message: string, shouldExit: true} when args have more than 1 positives', () => {
        const { message, shouldExit } = checkIfOneOptionIsPresent(mockOptions, mockBadArgs2);
        expect(message).toBe('Please specify exactly one of the options: -p, -q, -z');
        expect(shouldExit).toBe(true);
    });
});
