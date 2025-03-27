import { dirname } from 'path';
import { fileURLToPath } from 'url';

export const getEnvTemplate = (packageType) => {
    const appRoot = dirname(fileURLToPath(import.meta.url)).split('src')[0] ?? '';
    return packageType === 'wp'
        ? `${appRoot}src/templates/env/example-s.env`
        : packageType === 'nuxt'
          ? `${appRoot}src/templates/env/example-nuxt.env`
          : '';
};
