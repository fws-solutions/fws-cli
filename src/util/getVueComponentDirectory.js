import { resolve } from 'path';

export const getVueComponentDirectory = (packageMetadata) => {
    switch (packageMetadata.packageType) {
        // case 'wp':
        //     return resolve(packageMetadata.projectRoot, 'src/vue/components');
        case 'nuxt':
            return resolve(packageMetadata.projectRoot, 'components');
        case 'vue':
            return resolve(packageMetadata.projectRoot, 'src/components');
        default:
            return '';
    }
};
