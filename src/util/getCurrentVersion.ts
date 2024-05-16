import { readFileSync } from 'fs';

export const getCurrentVersion = (): string => {
    const appRoot = __dirname.split('src')[0];
    const packageJsonPath = `${appRoot}package.json`;

    try {
        const packageJson = readFileSync(packageJsonPath, 'utf8');
        return JSON.parse(packageJson).version;
    } catch (error) {
        console.log('Something went wrong...');
        console.log(error);
        return '';
    }
};
