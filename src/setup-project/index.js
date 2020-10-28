/**
 * Setup New Project
 *
 * @description CLI for new project setup.
 */
const fs = require('fs');
const path = require('path');
const colors = require('ansi-colors');
const readline = require('readline');
const parse = require('parse-git-config');
const yaml = require('yaml');
const helpers = require('../helpers');
const spWPConfig = require('./setup-project-wp-config');
const spLando = require('./setup-project-lando');
const spNpm = require('./setup-project-npm');
const spHtaccess = require('./setup-project-wp-htaccess');

module.exports = {
    rl: null,
    projectName: '',
    themeName: '',
    devServer: '',
    hostName: '',
    isLando: true,
    landoFileCreated: false,
    wpConfigFileCreated: false,
    htaccessFileCreated: false,
    wpMigrateDbKey: '',
    wpThemePrefix: 'fws-',
    wpThemeDir: path.join(process.cwd(), '/wp-content/themes/'),
    landoConfigDir: path.join(process.cwd(), '/.lando.yml'),

    init: function(wpConfigSample) {
        this.wpConfigSample = wpConfigSample;
        this.projectName = this.getRepositoryName();
        this.themeName = this.getWPThemeName();

        // init inputs
        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        // set and create files
        this.isLandoEnv();
        this.createFiles();
    },

    isLandoEnv: function() {
        // set project name
        const _this = this;
        const question = colors['magenta']('Use Lando Env? (Y/N): ');
        const confirmed = ['yes', 'y', 'yeahbaby', 'ofcourse', 'sure', 'yessir', 'whatelse'];

        this.rl.question(question, answer => {
            const a = answer.toLowerCase().trim().replace(' ', '');

            if (!confirmed.includes(a)) {
                _this.isLando = false;
                _this.setThemeName();
                return null;
            }

            _this.setProjectName();
        });
    },

    setProjectName: function() {
        // skip if project name is set
        if (this.projectName) {
            this.setThemeName();
            return null;
        }

        // set project name
        const _this = this;
        const question = colors['magenta']('Project Name (Slug): ');

        this.rl.question(question, name => {
            _this.projectName = name.trim();
            _this.setThemeName();
        });
    },

    setThemeName: function() {
        // skip if theme name is set
        if (this.themeName) {
            this.enterHostName();
            return null;
        }

        // set theme name
        const _this = this;
        const question = colors['magenta']('Theme Name (Slug): ');

        this.rl.question(question, name => {
            _this.themeName = name.trim();
            _this.enterHostName();
        });
    },

    enterHostName: function() {
        // skip if is lando
        if (this.isLando) {
            this.enterDevServer();
            return null;
        }

        // set local host
        const _this = this;
        const question = colors['magenta']('Local Host (URL): ');

        this.rl.question(question, url => {
            _this.hostName = _this.cleanUrl(url)
            _this.enterDevServer();
        });
    },

    enterDevServer: function() {
        // set dev server
        const _this = this;
        const question = colors['magenta']('Dev Server (URL): ');

        this.rl.question(question, url => {
            _this.devServer = _this.cleanUrl(url)
            _this.enterWPMigrateDBProLicence();
        });
    },

    cleanUrl: function(name) {
        let cleanName = name.trim();
        cleanName = cleanName.replace('https://', '');
        cleanName = cleanName.replace('http://', '');

        if (cleanName.substr(-1, 1) === '/') {
            cleanName = cleanName.slice(0, -1);
        }

        return cleanName;
    },

    enterWPMigrateDBProLicence: function() {
        const _this = this;
        const question = colors['magenta']('WP Migrate DB Pro Key: ');

        this.rl.question(question, key => {
            _this.wpMigrateDbKey = key.trim();
            _this.rl.close();
        });
    },

    createFiles: function() {
        const _this = this;

        // submit entered values
        this.rl.on('close', async function() {
            if (_this.invalidInputs()) {
                const msg = 'This command does not except naming with spaces.\n    Please do not use space characters.';
                helpers.consoleLogWarning(msg, 'red', true);
            }

            // create .lando.yml file
            if (_this.isLando) {
                _this.hostName = spLando.init(_this.projectName, _this.themeName, _this.landoConfigDir);
                _this.landoFileCreated = true;
                _this.checkHostName();
            }

            // create wp-config.php file
            _this.wpConfigFileCreated = await spWPConfig.init(_this.wpConfigSample);

            // create wp-content/uploads/.htaccess file
            _this.htaccessFileCreated = spHtaccess.init(_this.hostName, _this.devServer);

            // log created files
            _this.logReport();

            // run npm install and build in theme's root directory
            spNpm.init(_this.themeName, _this.wpThemeDir);
        });
    },

    checkHostName: function() {
        if (!this.hostName) {
            const hostName = fs.readFileSync(this.landoConfigDir, 'utf8');
            this.hostName = yaml.parse(hostName)['proxy']['appserver'][0];
        }
    },

    getRepositoryName: function() {
        const gitConfig = parse.sync()['remote "origin"'];

        if (!gitConfig) {
            helpers.consoleLogWarning('WARNING: No Git repository found!');
            return null;
        }

        const repoUrl = gitConfig.url.split('/');
        const repoName = repoUrl[repoUrl.length - 1];

        return repoName.replace('.git', '');
    },

    getWPThemeName: function() {
        const themes = fs.readdirSync(this.wpThemeDir);
        let themeName = '';

        themes.forEach(cur => {
            if (cur.substr(0, 4) === this.wpThemePrefix) {
                themeName = cur;
            }
        });

        return themeName;
    },

    invalidInputs: function() {
        return this.projectName.indexOf(' ') > -1 || this.themeName.indexOf(' ') > -1;
    },

    logReport: function() {
        let report = '';
        const landoCreated = colors.green('- File .lando.yml is created!');
        const landoExists = colors.yellow('- File .lando.yml already exists!');
        const landoSkipped = colors.cyan('- Skipped Lando setup.');
        const wpConfigCreated = colors.green('- File wp-config.php is created!');
        const wpConfigExists = colors.yellow('- File wp-config.php already exists!');
        const htAccessCreated = colors.green('- File .htaccess is created!');
        const htAccessExists = colors.yellow('- File .htaccess already exists!');

        // lando report
        if (!this.isLando) {
            report += landoSkipped + '\n';
        } else {
            report += this.landoFileCreated ? landoCreated : landoExists;
            report += '\n';
        }

        // wp-config report
        report += '\t';
        report += this.wpConfigFileCreated ? wpConfigCreated : wpConfigExists;
        report += '\n';

        // htaccess report
        report += '\t';
        report += this.htaccessFileCreated ? htAccessCreated : htAccessExists;

        // log full report
        helpers.consoleLogReport('REPORT:', report);
    }
};
