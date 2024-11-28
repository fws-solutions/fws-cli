import { readFileSync } from 'fs';
export const getPackageJson = (path) => {
    try {
        const packageJson = JSON.parse(readFileSync(path, 'utf-8'));
        return packageJson;
    } catch (e) {
        return {};
    }
};
