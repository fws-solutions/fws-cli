export const getDirType = (type, isNewWPStarter) => {
    switch (type) {
        case 'block':
        case 'blockVue':
            return 'block';
        case 'listing':
            return isNewWPStarter ? 'layout' : 'listing';
        case 'part':
        case 'partVue':
            return 'part';
        default:
            return '';
    }
};
