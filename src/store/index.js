/**
 * Store
 */

const fs = require('fs');
const path = require('path');
const parse = require('parse-git-config');
const helpers = require('../helpers');

const Store = {
    data: {
        cliVersion: '0.3.4',
        isWin: false,
        modulePath: path.dirname(__dirname),
        projectRoot: '',
        packageJsonPath: '',
        packageJson: null,
        projectName: '',
        starter: '',
        wpConfigSamplePath: '',
        wpThemePath: '',
        wpThemeName: ''
    },

    mutations: {
        setIsWin: function(isWin) {
            Store.data.isWin = isWin;
        },
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
        setPackageJsonPath: function(packageJsonDir) {
            Store.data.packageJsonPath = packageJsonDir;
        },
        setPackageJson: function(packageJson) {
            Store.data.packageJson = packageJson;
        },
        setProjectName: function(projectName) {
            Store.data.projectName = projectName;
        }
    },

    actions: {
        setIsWin: function() {
            const isWin = /^win/.test(process.platform);
            Store.mutations.setIsWin(isWin);
        },
        setProjectRoot: function() {
            let currentPath = process.cwd();
            const checkForRoot = function(currentPath) {
                return (
                    (!fs.existsSync(path.join(currentPath, 'wp-content')) && currentPath !== '/') &&
                    !fs.existsSync(path.join(currentPath, 'nuxt.config.js')) &&
                    !fs.existsSync(path.join(currentPath, 'vue.config.js')) &&
                    !fs.existsSync(path.join(currentPath, 'src/pages/index.twig'))
                );
            };

            while (checkForRoot(currentPath)) {
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
        setPackageJsonPath: function() {
            const packageJsonWPDir = path.join(
                Store.data.projectRoot,
                'wp-content',
                'themes',
                Store.data.wpThemeName,
                'package.json'
            );

            const packageJsonDir = fs.existsSync(packageJsonWPDir) ? packageJsonWPDir : path.join(Store.data.projectRoot, 'package.json');
            Store.mutations.setPackageJsonPath(packageJsonDir);
        },
        setPackageJson: function() {
            if (!fs.existsSync(Store.data.packageJsonPath)) {
                return null;
            }

            const packageJson = JSON.parse(fs.readFileSync(Store.data.packageJsonPath, 'utf8'));
            Store.mutations.setPackageJson(packageJson);
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
        getCliVersion: function() {
            return Store.data.cliVersion;
        },
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
            return Store.data.packageJson;
        },
        getProjectName: function() {
            return Store.data.projectName;
        }
    }
};

module.exports = Store;
