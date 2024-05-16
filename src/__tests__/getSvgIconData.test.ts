import { getSvgIconData } from '../util/getSvgIconData';
import { ISvgIconData } from '../interfaces/interfaces';

describe('util/getSvgIconData - testing get svg icon data', () => {
    it('should return data for wp packageType', () => {
        const projectRoot = '/path/to/project';
        const packageType = 'wp';

        const result: ISvgIconData = getSvgIconData(projectRoot, packageType);

        expect(result.svgIconFile).toContain('SvgIconGen.vue');
        expect(result.compiledImportSrc).toContain('../../../../assets/svg/');
        expect(result.templateFile).toBe('temp-svg-gen-vue-js.txt');
    });

    it('should return data for nuxt packageType', () => {
        const projectRoot = '/path/to/project';
        const packageType = 'nuxt';

        const result: ISvgIconData = getSvgIconData(projectRoot, packageType);

        expect(result.svgIconFile).toContain('SvgIconGen.vue');
        expect(result.compiledImportSrc).toContain('~/assets/svg/');
        expect(result.templateFile).toBe('temp-svg-gen-vue-js.txt');
    });

    it('should return data for vue packageType', () => {
        const projectRoot = '/path/to/project';
        const packageType = 'vue';

        const result: ISvgIconData = getSvgIconData(projectRoot, packageType);

        expect(result.svgIconFile).toContain('SvgIconGen.vue');
        expect(result.compiledImportSrc).toContain('@/assets/svg/');
        expect(result.templateFile).toBe('temp-svg-gen-vue-ts.txt');
    });

    it('should return default values for unknown packageType', () => {
        const projectRoot = '/path/to/project';
        const packageType = 'unknown';

        const result: ISvgIconData = getSvgIconData(projectRoot, packageType);

        expect(result.svgIconFile).toBe('');
        expect(result.compiledImportSrc).toBe('');
        expect(result.templateFile).toBe('');
    });
});
