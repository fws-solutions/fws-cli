import WordPressPackage from '../domain/Package/WordPressPackage.js';
import VuePackage from '../domain/Package/VuePackage.js';
import NuxtPackage from '../domain/Package/NuxtPackage.js';
import NextPackage from '../domain/Package/NextPackage.js';

const packageClasses = [WordPressPackage, VuePackage, NuxtPackage, NextPackage];

export const packageMap = () => {
    for (const PackageClass of packageClasses) {
        const packageInstance = new PackageClass();
        if (packageInstance.is()) {
            return packageInstance;
        }
    }
    return null;
};
