const fs = require('fs');
const path = require('path');
const fancyLog = require('fancy-log');
const colors = require('ansi-colors');
const notifier = require('node-notifier');
const _template = require('lodash.template');
const moduleDir = path.dirname(__dirname);
const execSync = require('child_process').execSync;

module.exports = {
    starterVue: 'fws_starter_vue',
    starterNuxt: 'fws_starter_nuxt',
    starterS: 'fws_starter_s',
    starterTwig: 'fws_starter_twig',
    moduleDir: path.dirname(__dirname),
    warningTemp: path.join(moduleDir, '/templates/temp-warning-log.txt'),
    wpConfigSampleDir: path.join(process.cwd(), '/wp-config-sample.php'),
    packageJsonDir: path.join(process.cwd(), '/package.json'),

    rf(src, callback) {
        /*
        * Helper for FS readFile function.  */
        fs.readFile(src, 'utf8', function(err, data) {
            if (!err) {
                callback(data);
            } else {
                fancyLog(colors.red('ERROR: ', err));
            }
        });
    },

    consoleLogWarning(message, color = 'yellow', error = false) {
        /*
        * Log warning messages using a template.  */
        const warningTemp = fs.readFileSync(module.exports.warningTemp, 'utf8');
        const compiled = _template(warningTemp);
        fancyLog(colors[color](compiled({message: message})));

        if (error) {
            this.errorNotify(message);
            process.exit(1);
        }
    },

    consoleLogReport(title, message) {
        console.log(colors.magenta('\n------------------------------------------------------------------------'));
        console.log(colors.magenta(`\t${title}\n`));
        console.log(`\t${message}`);
        console.log(colors.magenta('------------------------------------------------------------------------\n'));
    },

    errorNotify(message) {
        notifier.notify({
            title: 'ERROR',
            icon: path.join(moduleDir, '/assets/error-icon.png'),
            message: message,
            time: 1000,
            type: 'error'
        });
    },

    camelize: function(str) {
        return str.replace(/-(\w)/g, (_, c) => c ? c.toUpperCase() : '');
    },

    cleanCmdArgs: function(cmd) {
        /*
        * Package commander passes the cmd object itself as options,
        * extract only passed values into a fresh object. */
        if (!cmd) {
            return null;
        } else {
            return cmd.options.reduce(function(agg, cur) {
                const key = module.exports.camelize(cur.long.replace(/^--/, ''));

                /*
                * In case an option is not present and a command has a method with the same name,
                * it should not be copied */
                if (typeof cmd[key] !== 'function' && typeof cmd[key] !== 'undefined') {
                    agg[key] = cmd[key];
                }

                return agg;
            }, {});
        }
    },

    mapCommand: function(program, alias, script, desc) {
        program
            .command(script)
            .alias(alias)
            .description(desc)
            .action(function() {
                module.exports.runTask(script);
            });
    },

    runTask: function(task) {
        execSync('npm run ' + task, {stdio: [0, 1, 2]});
    },

    compileTemplate: function(templateFile, data) {
        // get template file
        const tempSrc = path.join(module.exports.moduleDir, 'templates', templateFile);
        const tempFile = fs.readFileSync(tempSrc, 'utf8');
        // set compiler
        const templateCompiler = _template(tempFile);

        // return compiled data
        return templateCompiler(data);
    },

    getWPConfigSample: function() {
        if (!fs.existsSync(this.wpConfigSampleDir)) {
            return null;
        }

        return this.wpConfigSampleDir;
    },

    getPackageJson: function() {
        if (!fs.existsSync(this.packageJsonDir)) {
            return null;
        }

        return JSON.parse(fs.readFileSync(this.packageJsonDir, 'utf8'));
    }
};
