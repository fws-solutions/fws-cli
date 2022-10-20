import {resolve} from 'path';
import {readdirSync, existsSync, readFileSync} from 'fs';
export default class NuxtPackage {
    is() {
        return this.getPackageJson().forwardslash === 'fws_starter_nuxt';
    }

    getAssetsDirectory() {
        return resolve(this.getProjectRoot(), 'assets');
    }

    getPackageJson() {
        const packageJsonDir = existsSync(this.getProjectRoot(), 'package.json')
            ? resolve(this.getProjectRoot(), 'package.json')
            : resolve(process.cwd(), 'package.json');

        return JSON.parse(readFileSync(packageJsonDir, 'utf8'));
    }

    getProjectRoot() {
        return process.cwd();
    }
}
