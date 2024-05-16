export const getDirType = (type: string): string => {
    switch (type) {
        case 'block':
        case 'blockVue':
            return 'block';
        case 'listing':
            return 'listing';
        case 'part':
        case 'partVue':
            return 'part';
        default:
            return '';
    }
};
