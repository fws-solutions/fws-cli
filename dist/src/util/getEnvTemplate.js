"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEnvTemplate = void 0;
const getEnvTemplate = (packageType) => {
    const appRoot = __dirname.split('src')[0];
    return packageType === 'wp'
        ? `${appRoot}src/templates/env/example-s.env`
        : packageType === 'nuxt'
            ? `${appRoot}src/templates/env/example-nuxt.env`
            : '';
};
exports.getEnvTemplate = getEnvTemplate;
