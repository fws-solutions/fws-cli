export const getVueComponentTemplate = (packageType: string): string => {
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
