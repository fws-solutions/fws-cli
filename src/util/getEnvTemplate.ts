export const getEnvTemplate = (packageType: string): string => {
    const appRoot = __dirname.split('src')[0];
    return packageType === 'wp'
        ? `${appRoot}src/templates/env/example-s.env`
        : packageType === 'nuxt'
          ? `${appRoot}src/templates/env/example-nuxt.env`
          : '';
};
