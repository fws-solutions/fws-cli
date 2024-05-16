import { getVueComponentDirectory } from '../util/getVueComponentDirectory';

describe('util/getVueComponentDirectory - testing get vue component directory', () => {
    it('should return the correct directory for Nuxt project', () => {
        const packageMetadata = {
            packageType: 'nuxt',
            projectRoot: '/path/to/nuxt/project',
            packageJsonDir: '',
            assetsDir: '',
            packageJson: null,
            isValid: true,
        };

        const result = getVueComponentDirectory(packageMetadata);
        expect(result).toBe('/path/to/nuxt/project/components');
    });

    it('should return the correct directory for Vue project', () => {
        const packageMetadata = {
            packageType: 'vue',
            projectRoot: '/path/to/vue/project',
            packageJsonDir: '',
            assetsDir: '',
            packageJson: null,
            isValid: true,
        };

        const result = getVueComponentDirectory(packageMetadata);
        expect(result).toBe('/path/to/vue/project/src/components');
    });

    it('should return an empty string for unknown package type', () => {
        const packageMetadata = {
            packageType: 'unknown',
            projectRoot: '/path/to/unknown/project',
            packageJsonDir: '',
            assetsDir: '',
            packageJson: null,
            isValid: true,
        };

        const result = getVueComponentDirectory(packageMetadata);
        expect(result).toBe('');
    });
});
