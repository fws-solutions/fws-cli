const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const fancyLog = require('fancy-log');
const colors = require('ansi-colors');
const spinner = require('cli-spinner').Spinner;
const notifier = require('node-notifier');
const _template = require('lodash.template');
const moduleDir = path.dirname(__dirname);
const store = require('./store');

module.exports = {
    starterVue: 'fws_starter_vue',
    starterNuxt: 'fws_starter_nuxt',
    starterS: 'fws_starter_s',
    starterTwig: 'fws_starter_twig',
    moduleDir: path.dirname(__dirname),
    warningTemp: path.join(moduleDir, '/templates/temp-warning-log.txt'),

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
            console.log(cmd);

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
        const spawnConfig = this.getSpawnConfig();
        const script = spawn(
            store.data.isWin ? 'npm.cmd' : 'npm',
            ['run', task],
            spawnConfig
        );

        script.on('close', (code) => {
            process.exit(code);
        });
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

    createLandoHostName: function(projectName) {
        return `${projectName}.lndo.site`;
    },

    createNestedDirectories(dirs, root) {
        let curPath = root ? root : store.getters.getProjectRoot();

        if (dirs.length > 0) {
            dirs.forEach(cur => {
                curPath = path.join(curPath, cur);

                if (!fs.existsSync(curPath)) {
                    fs.mkdirSync(curPath);
                }
            });
        }
    },

    getSpawnConfig: function() {
        const _this = this;
        const projectRoot = store.getters.getProjectRoot();
        const wpThemeDir = path.join(store.getters.getWpThemePath(), store.getters.getWpThemeName());
        const starter = store.getters.getStarter();

        return  {
            stdio: 'inherit',
            cwd: starter === _this.starterS ? wpThemeDir : projectRoot
        };
    },

    spawnScript: function(scriptName, scriptParams, spawnConfig, spinnerTitle, callback = null) {
        // spinner config
        const scriptSpinner = this.setSpinner(spinnerTitle);

        // start spinner before timeout delay
        scriptSpinner.start();

        setTimeout(() => {
            // stop after timeout delay
            scriptSpinner.stop();
            console.log('\n');

            // run bash script with spawn
            const script = spawn(scriptName, scriptParams, spawnConfig);

            // execute callback once spawn script is done
            script.on('close', (code) => {
                if (!callback) {
                    process.exit(code);
                }

                callback();
            });
        }, 1500);
    },

    quickSpawnScriptNPM: function(scriptParams, isPromise = false, callback = null) {
        const scriptSpinner = this.setSpinner(colors.cyan('%s ...checking latest @fws/cli version...'));

        // run script as-is or as a Promise
        if (isPromise) {
            // start spinner before timeout delay
            scriptSpinner.start();

            return new Promise(resolve => {
                runScript(resolve);
            });
        }

        runScript();

        // run spawn script
        function runScript(resolve = null) {
            // run bash script with spawn
            const script = spawn(store.data.isWin ? 'npm.cmd' : 'npm', scriptParams);
            let output = '';

            // handle output data
            script.stdin.setEncoding = 'utf-8';
            script.stdout.on('data', (data) => {
                output += data.toString();
            });

            // handle output error
            script.stderr.on('data', (data) => {
                console.log('error:' + data);
            });

            // execute callback once spawn script is done
            script.on('close', (code) => {
                if (callback) {
                    callback();
                }

                if (resolve) {
                    scriptSpinner.stop();
                    resolve(output);
                } else {
                    return output;
                }
            });
        }
    },

    setSpinner: function(spinnerTitle) {
        const scriptSpinner = new spinner();
        scriptSpinner.setSpinnerString('|/-\\');

        if (spinnerTitle) {
            scriptSpinner.setSpinnerTitle(spinnerTitle);
        }

        // adds space between spinner and following logs
        console.log('\n');

        return scriptSpinner;
    }
};
