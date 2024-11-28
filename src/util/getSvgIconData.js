import { resolve } from 'path';

export const getSvgIconData = (projectRoot, packageType) => {
    switch (packageType) {
        case 'wp':
            return {
                dir: resolve(projectRoot, 'src/vue/components/base/SvgIcon/'),
                svgIconFile: resolve(projectRoot, 'src/vue/components/base/SvgIcon/SvgIconGen.vue'),
                compiledImportSrc: '../../../../assets/svg/<%= fileName %>.svg',
                templateFile: 'temp-svg-gen-vue-js.txt',
            };
        case 'nuxt':
            return {
                dir: resolve(projectRoot, 'components/plugins/SvgIcon/'),
                svgIconFile: resolve(projectRoot, 'components/plugins/SvgIcon/SvgIconGen.vue'),
                compiledImportSrc: '~/assets/svg/<%= fileName %>.svg?inline',
                templateFile: 'temp-svg-gen-vue-js.txt',
            };
        case 'vue':
            return {
                dir: resolve(projectRoot, 'src/components/base/SvgIcon/'),
                svgIconFile: resolve(projectRoot, 'src/components/base/SvgIcon/SvgIconGen.vue'),
                compiledImportSrc: '@/assets/svg/<%= fileName %>.svg',
                templateFile: 'temp-svg-gen-vue-ts.txt',
            };
        default:
            return {
                dir: '',
                svgIconFile: '',
                compiledImportSrc: '',
                templateFile: '',
            };
    }
};
