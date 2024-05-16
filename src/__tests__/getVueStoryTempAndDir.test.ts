import { getVueStoryTempAndDir } from '../util/getVueStoryTempAndDir';

describe('util/getVueStoryTempAndDir - esting Vue story temp and directory', () => {
    it('should return the correct temp and dir for Nuxt project', () => {
        const packageType = 'nuxt';
        const result = getVueStoryTempAndDir(packageType);
        expect(result).toEqual({
            temp: 'temp-vue-story.txt',
            dir: 'stories',
        });
    });

    it('should return the correct temp and dir for Vue project', () => {
        const packageType = 'vue';
        const result = getVueStoryTempAndDir(packageType);
        expect(result).toEqual({
            temp: 'temp-vuets-story.txt',
            dir: 'src/stories',
        });
    });

    it('should return an empty temp and dir for unknown package type', () => {
        const packageType = 'unknown';
        const result = getVueStoryTempAndDir(packageType);
        expect(result).toEqual({
            temp: '',
            dir: '',
        });
    });
});
