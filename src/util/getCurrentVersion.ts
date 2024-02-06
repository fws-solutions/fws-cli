import { readFileSync } from 'fs';

export const getCurrentVersion = (): string => {
    const appRoot = __dirname.split('src')[0];
    const packageJson = `${appRoot}package.json`;
    return JSON.parse(readFileSync(packageJson, 'utf8')).version;
};
