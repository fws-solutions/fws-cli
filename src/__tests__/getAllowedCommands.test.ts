import { getAllowedCommands } from '../util/getAllowedCommands';

describe('util/getAllowedCommands - testing allowed commands', () => {
    it('should return empty array if package json is invalid', () => {
        const packageJson = {};
        const allowedCommands = getAllowedCommands(packageJson);
        expect(allowedCommands).toStrictEqual([]);
    });
    it('should return wp allowed commands if wp package is found', () => {
        const packageJson = { forwardslash: 'fws_starter_s' };
        const allowedCommands = getAllowedCommands(packageJson);
        expect(allowedCommands).toStrictEqual([
            'create-file',
            'remove-fe',
            'icons',
            'latest-version',
            'npmci',
            'npmi',
            'postinstall',
            'w3Validator',
        ]);
    });
    it('should return vue allowed commands if vue package is found', () => {
        const packageJson = { forwardslash: 'fws_starter_vue' };
        const allowedCommands = getAllowedCommands(packageJson);
        expect(allowedCommands).toStrictEqual([
            'create-file',
            'icons',
            'latest-version',
            'npmci',
            'npmi',
            'w3Validator',
        ]);
    });
    it('should return nuxt allowed commands if nuxt package is found', () => {
        const packageJson = { forwardslash: 'fws_starter_nuxt' };
        const allowedCommands = getAllowedCommands(packageJson);
        expect(allowedCommands).toStrictEqual([
            'create-file',
            'icons',
            'latest-version',
            'npmci',
            'npmi',
            'postinstall',
            'w3Validator',
        ]);
    });
    it('should return next allowed commands if next package is found', () => {
        const packageJson = { forwardslash: 'fws_starter_next' };
        const allowedCommands = getAllowedCommands(packageJson);
        expect(allowedCommands).toStrictEqual(['create-file', 'latest-version', 'npmci', 'npmi', 'w3Validator']);
    });
});
