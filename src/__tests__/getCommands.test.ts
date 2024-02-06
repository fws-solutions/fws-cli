import { getCommands } from '../util/getCommands';

describe('util/getCommands - test if commands are parsed correctly excluding npmci', () => {
    it('should return an array of commands including all', async () => {
        const cliCommands = [
            {
                name: 'npmci',
                description: 'npm ci',
                run: jest.fn(),
            },
            {
                name: 'npmi',
                description: 'npm install',
                run: jest.fn(),
            },
        ];
        const packageJsonCommands = [
            {
                name: 'test',
                description: 'run npm test',
                run: jest.fn(),
            },
            {
                name: 'format',
                description: 'run npm format',
                run: jest.fn(),
            },
        ];
        const allowedCommands = ['npmi', 'npmci', 'create-file', 'delete-fe-files'];
        const result = await getCommands(cliCommands, packageJsonCommands, allowedCommands);
        expect(result).toEqual([
            {
                name: 'npmci',
                description: 'npm ci',
                run: expect.any(Function),
            },
            {
                name: 'npmi',
                description: 'npm install',
                run: expect.any(Function),
            },
            {
                name: 'test',
                description: 'run npm test',
                run: expect.any(Function),
            },
            {
                name: 'format',
                description: 'run npm format',
                run: expect.any(Function),
            },
        ]);
    });
    it('should return an array of commands excluding npmci', async () => {
        const cliCommands = [
            {
                name: 'npmci',
                description: 'npm ci',
                run: jest.fn(),
            },
            {
                name: 'npmi',
                description: 'npm install',
                run: jest.fn(),
            },
        ];
        const packageJsonCommands = [
            {
                name: 'test',
                description: 'run npm test',
                run: jest.fn(),
            },
            {
                name: 'format',
                description: 'run npm format',
                run: jest.fn(),
            },
        ];
        const allowedCommands = ['npmi', 'create-file', 'delete-fe-files'];
        const result = await getCommands(cliCommands, packageJsonCommands, allowedCommands);
        expect(result).toEqual([
            {
                name: 'npmi',
                description: 'npm install',
                run: expect.any(Function),
            },
            {
                name: 'test',
                description: 'run npm test',
                run: expect.any(Function),
            },
            {
                name: 'format',
                description: 'run npm format',
                run: expect.any(Function),
            },
        ]);
    });
});
