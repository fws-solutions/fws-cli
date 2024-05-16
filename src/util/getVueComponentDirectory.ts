import { IPackageMetadata } from '../interfaces/interfaces';
import { resolve } from 'path';

export const getVueComponentDirectory = (packageMetadata: IPackageMetadata): string => {
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
