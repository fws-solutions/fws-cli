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
const helpers = require('../helpers');
const spWPConfig = require('./setup-project-wp-config');
const spLando = require('./setup-project-lando');
const spNpm = require('./setup-project-npm');
const terminalImage = require('terminal-image');

module.exports = {
    rl: null,
    projectName: '',
    themeName: '',
    isLando: true,
    landoFileCreated: false,
    wpConfigFileCreated: false,
    wpMigrateDbKey: '',
    wpThemePrefix: 'fws-',
    wpThemeDir: path.join(process.cwd(), '/wp-content/themes/'),

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




        // (async () => {
        //     console.log(await terminalImage.file(path.join(helpers.moduleDir, 'fws.jpeg'), {width: 70}));
        //     process.exit();
        // })();
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
            this.enterWPMigrateDBProLicence();
            return null;
        }

        // set theme name
        const _this = this;
        const question = colors['magenta']('Theme Name (Slug): ');

        this.rl.question(question, name => {
            _this.themeName = name.trim();
            _this.enterWPMigrateDBProLicence();
        });
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

            if (_this.isLando) {
                _this.landoFileCreated = spLando.init(_this.projectName, _this.themeName);
            }

            _this.wpConfigFileCreated = await spWPConfig.init(_this.wpConfigSample);

            _this.logReport();

            spNpm.init(_this.themeName, _this.wpThemeDir);
        });
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

        // format report
        if (!this.isLando) {
            report += landoSkipped + '\n';
        } else {
            report += this.landoFileCreated ? landoCreated : landoExists;
            report += '\n';
        }

        report += '\t';
        report += this.wpConfigFileCreated ? wpConfigCreated : wpConfigExists;

        // log report
        helpers.consoleLogReport('REPORT:', report);
    }
};
