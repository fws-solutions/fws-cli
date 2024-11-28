export const getEnvTemplate = (packageType) => {
    const appRoot = import.meta.dirname.split('src')[0];
    return packageType === 'wp'
        ? `${appRoot}src/templates/env/example-s.env`
        : packageType === 'nuxt'
          ? `${appRoot}src/templates/env/example-nuxt.env`
          : '';
};
