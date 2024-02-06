import { getAssetsDir } from '../util/getAssetsDir';
import { resolve } from 'path';

describe('util/getAssetsDir - testing assets dir', () => {
    it('should return correct path for "vue" package type', () => {
        const packageType = 'vue';
        const rootPath = '/path/to/root';
        const result = getAssetsDir(packageType, rootPath);
        expect(result).toBe(resolve(rootPath, 'src/assets'));
    });
    it('should return correct path for "wp" package type', () => {
        const packageType = 'wp';
        const rootPath = '/path/to/root';
        const result = getAssetsDir(packageType, rootPath);
        expect(result).toBe(resolve(rootPath, 'src/assets'));
    });
    it('should return correct path for "next" package type', () => {
        const packageType = 'next';
        const rootPath = '/path/to/root';
        const result = getAssetsDir(packageType, rootPath);
        expect(result).toBe(resolve(rootPath, 'assets'));
    });
    it('should return correct path for "nuxt" package type', () => {
        const packageType = 'nuxt';
        const rootPath = '/path/to/root';
        const result = getAssetsDir(packageType, rootPath);
        expect(result).toBe(resolve(rootPath, 'assets'));
    });
    it('should return empty string for unknown package types', () => {
        const packageType = 'unknown';
        const rootPath = '/path/to/root';
        const result = getAssetsDir(packageType, rootPath);
        expect(result).toBe('');
    });
});
