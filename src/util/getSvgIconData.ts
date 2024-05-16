import { resolve } from 'path';
import { ISvgIconData } from '../interfaces/interfaces';

export const getSvgIconData = (projectRoot: string, packageType: string): ISvgIconData => {
    switch (packageType) {
        case 'wp':
            return {
                svgIconFile: resolve(projectRoot, 'src/vue/components/base/SvgIcon/SvgIconGen.vue'),
                compiledImportSrc: '../../../../assets/svg/<%= fileName %>.svg',
                templateFile: 'temp-svg-gen-vue-js.txt',
            };
        case 'nuxt':
            return {
                svgIconFile: resolve(projectRoot, 'components/plugins/SvgIcon/SvgIconGen.vue'),
                compiledImportSrc: '~/assets/svg/<%= fileName %>.svg?inline',
                templateFile: 'temp-svg-gen-vue-js.txt',
            };
        case 'vue':
            return {
                svgIconFile: resolve(projectRoot, 'src/components/base/SvgIcon/SvgIconGen.vue'),
                compiledImportSrc: '@/assets/svg/<%= fileName %>.svg',
                templateFile: 'temp-svg-gen-vue-ts.txt',
            };
        default:
            return {
                svgIconFile: '',
                compiledImportSrc: '',
                templateFile: '',
            };
    }
};
