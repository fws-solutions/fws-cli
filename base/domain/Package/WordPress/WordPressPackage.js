import {resolve} from 'path';
import {readdirSync, existsSync, readFileSync} from 'fs';
export default class WordPressPackage {
    is() {
        return this.getPackageJson().forwardslash === 'fws_starter_s';
    }

    getAssetsDirectory() {
        return resolve(this.getProjectRoot(), 'src/assets');
    }

    getPackageJson() {
        const packageJsonDir = existsSync(this.getProjectRoot(), 'package.json')
            ? resolve(this.getProjectRoot(), 'package.json')
            : resolve(process.cwd(), 'package.json');

        return JSON.parse(readFileSync(packageJsonDir, 'utf8'));
    }

    getProjectRoot() {
        const themes = readdirSync(resolve(process.cwd(),'wp-content','themes'));
        let themeName = '';

        themes.forEach(cur => {
            if (cur.substr(0, 4) === 'fws-') {
                themeName = cur;
            }
        });

        return resolve(
            process.cwd(),
            'wp-content',
            'themes',
            themeName
        );
    }
}