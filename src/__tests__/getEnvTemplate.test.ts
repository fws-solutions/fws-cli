import { getEnvTemplate } from '../util/getEnvTemplate';

describe('util/getEnvTemplate.ts - testing env paths', () => {
    it('should return the correct template path for wp package type', () => {
        const result = getEnvTemplate('wp');
        expect(result).toEqual(expect.stringContaining('/templates/env/example-s.env'));
    });

    it('should return the correct template path for nuxt package type', () => {
        const result = getEnvTemplate('nuxt');
        expect(result).toEqual(expect.stringContaining('/templates/env/example-nuxt.env'));
    });

    it('should return an empty string for unknown package type', () => {
        const result = getEnvTemplate('vue');
        expect(result).toEqual('');
    });
});
