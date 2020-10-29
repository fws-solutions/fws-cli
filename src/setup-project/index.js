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
const figlet = require('figlet');
const helpers = require('../helpers');
const spWPConfig = require('./setup-project-wp-config');
const spLandoConfig = require('./setup-project-lando-config');
const spLandoStart = require('./setup-project-lando-start');
const spNpm = require('./setup-project-npm');
const spHtaccess = require('./setup-project-wp-htaccess');
const spGithub = require('./setup-project-github-wpengine');

module.exports = {
    rl: null,
    projectName: '',
    themeName: '',
    devServer: '',
    hostName: '',
    isLando: true,
    wpMigrateDbKey: '',
    wpThemePrefix: 'fws-',
    wpThemeDir: path.join(process.cwd(), '/wp-content/themes/'),
    landoConfigDir: path.join(process.cwd(), '/.lando.yml'),
    createdFiles: {
        lando: false,
        wpconfig: false,
        htaccess: false,
        github: false,
        deployIgnore: false
    },

    init: function(wpConfigSample) {
        this.wpConfigSample = wpConfigSample;
        this.projectName = this.getRepositoryName();
        this.themeName = this.getThemeName();

        // init inputs
        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        // run setup
        this.setupWelcome();
    },

    setupWelcome: function() {
        const _this = this;

        figlet('FWS', {font: 'Slant'}, function(err, data) {
            if (err) {
                console.log('Something went wrong...');
                console.dir(err);
                return;
            }
            console.log(colors['red'](data));

            // set and create files
            _this.inputIsLando();
            _this.createFiles();
        });
    },

    inputIsLando: function() {
        // set project name
        const _this = this;
        const question = colors['magenta']('Use Lando Env? (Y/N): ');
        const confirmed = ['yes', 'y', 'yeahbaby', 'ofcourse', 'sure', 'yessir', 'whatelse'];

        this.rl.question(question, answer => {
            const a = answer.toLowerCase().trim().replace(' ', '');

            if (!confirmed.includes(a)) {
                _this.isLando = false;
                _this.inputThemeName();
                return null;
            }

            _this.inputProjectName();
        });
    },

    inputProjectName: function() {
        // skip if project name is set
        if (this.projectName) {
            this.inputThemeName();
            return null;
        }

        // set project name
        const _this = this;
        const question = colors['magenta']('Project Name (Slug): ');

        this.rl.question(question, name => {
            _this.projectName = name.trim();
            _this.inputThemeName();
        });
    },

    inputThemeName: function() {
        // skip if theme name is set
        if (this.themeName) {
            this.inputLocalHost();
            return null;
        }

        // set theme name
        const _this = this;
        const question = colors['magenta']('Theme Name (Slug): ');

        this.rl.question(question, name => {
            _this.themeName = name.trim();
            _this.inputLocalHost();
        });
    },

    inputLocalHost: function() {
        // skip if is lando
        if (this.isLando) {
            this.inputDevServer();
            return null;
        }

        // set local host
        const _this = this;
        const question = colors['magenta']('Local Host (URL): ');

        this.rl.question(question, url => {
            _this.hostName = _this.cleanUrl(url);
            _this.inputDevServer();
        });
    },

    inputDevServer: function() {
        // set dev server
        const _this = this;
        const question = colors['magenta']('Dev Server (URL): ');

        this.rl.question(question, url => {
            _this.devServer = _this.cleanUrl(url);
            _this.inputMigrateLicence();
        });
    },

    inputMigrateLicence: function() {
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
                _this.hostName = spLandoConfig.init(_this.projectName, _this.themeName, _this.landoConfigDir);
                _this.createdFiles.lando = !!_this.hostName;
                _this.getLocalHostName();
            }

            // create wp-config.php file
            _this.createdFiles.wpconfig = await spWPConfig.init(_this.wpConfigSample, _this.wpMigrateDbKey);

            // create wp-content/uploads/.htaccess file
            _this.createdFiles.htaccess = spHtaccess.init(_this.hostName, _this.devServer);

            // create .github config pipeline
            const githubFiles = spGithub.init(_this.themeName, _this.devServer);
            _this.createdFiles.github = githubFiles.githubConfig;
            _this.createdFiles.deployIgnore = githubFiles.deployGitIgnore;

            // log created files
            _this.logReport();

            // run 'npm install', build in theme's root directory and start lando
            spNpm.init(
                _this.themeName,
                _this.wpThemeDir,
                spLandoStart.init.bind(spLandoStart, _this.projectName)
            );
        });
    },

    invalidInputs: function() {
        return this.projectName.indexOf(' ') > -1 || this.themeName.indexOf(' ') > -1;
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

    getLocalHostName: function() {
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

    getThemeName: function() {
        const themes = fs.readdirSync(this.wpThemeDir);
        let themeName = '';

        themes.forEach(cur => {
            if (cur.substr(0, 4) === this.wpThemePrefix) {
                themeName = cur;
            }
        });

        return themeName;
    },

    logReport: function() {
        let report = '';
        const landoSkipped = colors.cyan('- Skipped Lando setup.');

        // lando report
        if (!this.isLando) {
            report += landoSkipped + '\n';
        } else {
            report += this.reportMessage('lando', '.lando.yml', true, false);
        }

        // create report messages
        report += this.reportMessage('wpconfig', 'wp-config.php');
        report += this.reportMessage('htaccess', '.htaccess');
        report += this.reportMessage('github', '.github');
        report += this.reportMessage('deployIgnore', 'deploy.gitignore', false);

        // log full report
        helpers.consoleLogReport('REPORT:', report);
    },

    reportMessage: function(file, name, n = true, t = true) {
        const isCreated = this.createdFiles[file];
        const created = 'is created!';
        const exist = 'already exists!';
        const msg = `- File ${name} ${isCreated ? created : exist}`;
        let report = '';

        report += t ? '\t' : '';
        report += colors[isCreated ? 'green' : 'yellow'](msg);
        report += n ? '\n' : '';

        return report;
    }
};
