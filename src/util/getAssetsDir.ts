import { resolve } from 'path';

export const getAssetsDir = (packageType: string, rootPath: string): string => {
    return ['vue', 'wp'].includes(packageType)
        ? resolve(rootPath, 'src/assets')
        : ['next', 'nuxt'].includes(packageType)
          ? resolve(rootPath, 'assets')
          : '';
};
