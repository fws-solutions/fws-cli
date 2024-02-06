import { getPackageType } from '../util/getPackageType';

describe('util/getPackageType - testing package types', () => {
    it('should return unknown if no package type is found', () => {
        const packageJson = {};
        const packageType = getPackageType(packageJson);
        expect(packageType).toBe('unknown');
    });
    it('should return wp package if wp package is found', () => {
        const packageJson = { forwardslash: 'fws_starter_s' };
        const packageType = getPackageType(packageJson);
        expect(packageType).toBe('wp');
    });
    it('should return vue package if vue package is found', () => {
        const packageJson = { forwardslash: 'fws_starter_vue' };
        const packageType = getPackageType(packageJson);
        expect(packageType).toBe('vue');
    });
    it('should return nuxt package if nuxt package is found', () => {
        const packageJson = { forwardslash: 'fws_starter_nuxt' };
        const packageType = getPackageType(packageJson);
        expect(packageType).toBe('nuxt');
    });
    it('should return next package if next package is found', () => {
        const packageJson = { forwardslash: 'fws_starter_next' };
        const packageType = getPackageType(packageJson);
        expect(packageType).toBe('next');
    });
});
