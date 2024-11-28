export const getVueComponentTemplate = (packageType) => {
    switch (packageType) {
        case 'wp':
            return 'temp-vue-component.txt';
        case 'nuxt':
            return 'temp-vue-component.txt';
        case 'vue':
            return 'temp-vuets-component.txt';
        default:
            return '';
    }
};
