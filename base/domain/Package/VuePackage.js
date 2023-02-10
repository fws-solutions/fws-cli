import {resolve} from 'path';
import {existsSync, readFileSync} from 'fs';
export default class VuePackage {
    is() {
        try {
            return this.getPackageJson().forwardslash === 'fws_starter_vue';
        } catch (exception) {
            return false;
        }
    }

    getAssetsDirectory() {
        return resolve(this.getProjectRoot(), 'src/assets');
    }

    getPackageJson() {
        const packageJsonFile = existsSync(this.getProjectRoot(), 'package.json')
            ? resolve(this.getProjectRoot(), 'package.json')
            : resolve(process.cwd(), 'package.json');

        return JSON.parse(readFileSync(packageJsonFile, 'utf8'));
    }

    getProjectRoot() {
        return process.cwd();
    }
}