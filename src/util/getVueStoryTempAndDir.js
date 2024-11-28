export const getVueStoryTempAndDir = (packageType) => {
    switch (packageType) {
        case 'nuxt':
            return {
                temp: 'temp-vue-story.txt',
                dir: 'stories',
            };
        case 'vue':
            return {
                temp: 'temp-vuets-story.txt',
                dir: 'src/stories',
            };
        default:
            return {
                temp: '',
                dir: '',
            };
    }
};
