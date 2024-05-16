import { getVueComponentTemplate } from '../util/getVueComponentTemplate';

describe('util/getVueComponentTemplate - testing get vue component template', () => {
    it('should return the correct template for wp project', () => {
        const packageType = 'wp';

        const result = getVueComponentTemplate(packageType);
        expect(result).toBe('temp-vue-component.txt');
    });

    it('should return the correct template for nuxt project', () => {
        const packageType = 'nuxt';

        const result = getVueComponentTemplate(packageType);
        expect(result).toBe('temp-vue-component.txt');
    });

    it('should return the correct template for vue project', () => {
        const packageType = 'vue';

        const result = getVueComponentTemplate(packageType);
        expect(result).toBe('temp-vuets-component.txt');
    });

    it('should return an empty string for unknown package type', () => {
        const packageType = 'unknown';

        const result = getVueComponentTemplate(packageType);
        expect(result).toBe('');
    });
});
