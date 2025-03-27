import { readFileSync } from 'fs';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

export const getCurrentVersion = () => {
    const appRoot = dirname(fileURLToPath(import.meta.url)).split('src')[0] ?? '';
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
