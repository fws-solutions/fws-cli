/**
 * Store
 */

const fs = require('fs');
const path = require('path');
const parse = require('parse-git-config');
const helpers = require('../helpers');

const Store = {
    data: {
        modulePath: path.dirname(__dirname),
        projectRoot: '',
        projectName: '',
        starter: '',
        wpConfigSamplePath: path.join(process.cwd(), '/wp-config-sample.php'),
        wpThemePath: '',
        wpThemeName: '',
        wpPackageJsonPath: '',
        wpPackageJson: null
    },

    mutations: {
        setProjectRoot: function(value) {
            Store.data.projectRoot = value;
        },
        setStarter: function(starter) {
            Store.data.starter = starter;
        },
        setWpConfigSamplePath: function(wpConfigPath) {
            Store.data.wpConfigSamplePath = wpConfigPath;
        },
        setWpThemePath: function(themeDir) {
            Store.data.wpThemePath = themeDir;
        },
        setThemeName: function(themeName) {
            Store.data.wpThemeName = themeName;
        },
        setWpPackageJsonPath: function(packageJsonDir) {
            Store.data.wpPackageJsonPath = packageJsonDir;
        },
        setWpPackageJson: function(packageJson) {
            Store.data.wpPackageJson = packageJson;
        },
        setProjectName: function(projectName) {
            Store.data.projectName = projectName;
        }
    },

    actions: {
        setProjectRoot: function() {
            let currentPath = process.cwd();

            while (!fs.existsSync(path.join(currentPath, 'wp-content')) && currentPath !== '/') {
                currentPath = path.dirname(currentPath);
            }

            Store.mutations.setProjectRoot(currentPath);
        },
        setWpConfigSamplePath: function() {
            const wpConfigPath = path.join(Store.data.projectRoot, 'wp-config-sample.php');
            Store.mutations.setWpConfigSamplePath(wpConfigPath);
        },
        setWpThemePath: function() {
            const themeDir = path.join(Store.data.projectRoot, 'wp-content/themes');
            Store.mutations.setWpThemePath(themeDir);
        },
        setThemeName: function() {
            const themes = fs.readdirSync(Store.data.wpThemePath);
            let themeName = '';

            themes.forEach(cur => {
                if (cur.substr(0, 4) === 'fws-') {
                    themeName = cur;
                }
            });

            Store.mutations.setThemeName(themeName);
        },
        setWpPackageJsonPath: function() {
            const packageJsonDir = path.join(
                Store.data.projectRoot,
                'wp-content',
                'themes',
                Store.data.wpThemeName,
                'package.json'
            );

            Store.mutations.setWpPackageJsonPath(packageJsonDir);
        },
        setPackageJson: function() {
            if (!fs.existsSync(Store.data.wpPackageJsonPath)) {
                return null;
            }

            const packageJson = JSON.parse(fs.readFileSync(Store.data.wpPackageJsonPath, 'utf8'));
            Store.mutations.setWpPackageJson(packageJson);
        },
        setProjectName: function() {
            const gitConfig = parse.sync()['remote "origin"'];

            if (!gitConfig) {
                if (!fs.existsSync(path.join(process.cwd(), 'package.json'))) {
                    helpers.consoleLogWarning('WARNING: No Git repository found!');
                }

                return null;
            }

            const repoUrl = gitConfig.url.split('/');
            const repoName = repoUrl[repoUrl.length - 1];

            Store.mutations.setProjectName(repoName.replace('.git', ''));
        }
    },

    getters: {
        getModulePath: function() {
            return Store.data.modulePath;
        },
        getProjectRoot: function() {
            return Store.data.projectRoot;
        },
        getStarter: function() {
            return Store.data.starter;
        },
        getWpThemeName: function() {
            return Store.data.wpThemeName;
        },
        getWpThemePath: function() {
            return Store.data.wpThemePath;
        },
        getWpConfigSamplePath: function() {
            return Store.data.wpConfigSamplePath;
        },
        getWpPackageJson: function() {
            return Store.data.wpPackageJson;
        },
        getProjectName: function() {
            return Store.data.projectName;
        }
    }
};

module.exports = Store;
