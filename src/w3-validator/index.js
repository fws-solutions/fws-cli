/**
 * W3 Validation
 *
 * @description Validate domain via W3 API. Currently only supports WP projects that have REST API enabled.
 */
const fancyLog = require('fancy-log');
const colors = require('ansi-colors');
const axios = require('axios');
const validator = require('html-validator');
const helpers = require('../helpers');
const isUrl = require('is-url');
const forOwn = require('lodash.forown');
const cliProgress = require('cli-progress');
const spinner = require('cli-spinner').Spinner;

// constructor for validator's config object
function ValidatorConfig(url, gulpDone) {
    this.url = url;
    this.format = 'text';
    this.ignore = [
        'Warning: The "type" attribute is unnecessary for JavaScript resources.',
        'Error: Attribute “item-id” not allowed on element “div” at this point.'
    ];

    // set local validation if run from gulp
    if (gulpDone) {
        this.isLocal = true;
    }
}

module.exports = {
    validateCount: 0,
    errorCount: 0,
    pageCount: 0,
    bar: new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic),
    barCount: 0,
    spinner: new spinner(colors.yellow('Loading WP REST API... %s')),
    gulpDone: null,
    errorReport: '',

    init: function(url, gulpDone = null) {
        this.processStatus(true);
        this.gulpDone = gulpDone;

        // check if passed argument is an url
        if (isUrl(url)) {
            this.spinner.setSpinnerString('|/-\\');

            this.getPostTypes(url);
        } else {
            this.processStatus();
            helpers.consoleLogWarning(`The passed argument '${url}' is not an URL.`, 'red', true);
        }
    },

    getPostTypes: async function(url) {
        // get endpoints for all wp post types
        try {
            this.spinner.start();
            const types = await axios.get(`${url}/wp-json/wp/v2/types`);
            let filteredTypes = [`${url}/wp-json/wp/v2/pages?per_page=100`];

            forOwn(types.data, function(value) {
                // exclude unneeded types
                if (value.slug !== 'attachment' && value.slug !== 'wp_block' && value.slug !== 'page') {
                    filteredTypes.push(`${value['_links']['wp:items'][0]['href']}?per_page=10`);
                }
            });

            this.getPages(filteredTypes);
        } catch (error) {
            if (error.code === 'ENOTFOUND') {
                this.processStatus();
                helpers.consoleLogWarning(`The URL '${url}' that you are trying to reach is unavailable or wrong.`, 'red', true);
            } else {
                console.error(error);
                this.processStatus();
                process.exit(1);
            }
        }
    },

    getPages: async function(types) {
        const _this = this;
        let promises = [];

        // send request for each rest api endpoint
        types.forEach(async (cur) => {
            promises.push(axios.get(cur));
        });

        // wait for all promises to finish
        Promise.all(promises).then(function(values) {
            const allURLs = values.reduce((agg, value) => {
                if (value.data.length > 0) {
                    value.data.forEach(cur => {
                        const isPdfUrl = cur.link.includes('spec-sheet-pdf');

                        if (!isPdfUrl) {
                            agg.push(cur.link);
                        }
                    });
                }

                return agg;
            }, []);

            // send filtered urls for validation
            _this.spinner.stop();
            _this.bar.start(allURLs.length, 0);
            _this.checkURLs(allURLs);
        }).catch(error => {
            console.error(error);
            this.processStatus();
            helpers.consoleLogWarning(error.message, 'red', true);
        });
    },

    checkURLs: function(URLs) {
        // loop through all urls
        URLs.forEach((url, i, a) => {
            this.validateHTML(url, a);
        });
    },

    validateHTML: async function(url, a) {
        // run w3 validator on passed url
        const config = new ValidatorConfig(url, this.gulpDone);

        try {
            let counter = 0;
            let result = await validator(config);
            const hasErrorsString = 'There were errors.';
            this.bar.update(++this.barCount);

            // check if results have errors
            if (result.includes(hasErrorsString)) {
                result = result.replace('\n' + hasErrorsString, '').split('\n');

                this.errorReport += colors.cyan(`\n\n### W3 Validator Error on Page: ${url}\n\n`);

                // count pages that have errors
                ++this.pageCount;

                result.forEach((cur, i) => {
                    // count errors
                    ++this.errorCount;

                    if (i % 2 !== 0) {
                        this.errorReport += colors.yellow(`\n    Location: ${cur}\n\n`);
                    } else {
                        counter++;
                        this.errorReport += `${colors.cyan(`--- No.#${counter} --------------------------------------------------------------`)}\n    ${colors.red(cur)}`;
                    }
                });
            }

            // count when last Validator promise is done and stop the script
            ++this.validateCount;
            this.detectProcessEnd(a.length);
        } catch (error) {
            console.error(error);
            this.processStatus();
            helpers.consoleLogWarning(error.message, 'red', true);
        }
    },

    detectProcessEnd: function(totalCount) {
        if (this.validateCount === totalCount) {
            this.validateCount = 0;
            if (this.pageCount > 0) {
                this.processStatus();
                // log error report
                console.log(this.errorReport);
                const errorMsg = `Found ${this.errorCount} errors, on ${this.pageCount} pages!`;
                this.errorCount = 0;
                this.pageCount = 0;
                // disable process.exit if run from gulp
                helpers.consoleLogWarning(errorMsg, 'red', !this.gulpDone);
                // show notification if run from gulp
                if (this.gulpDone) {
                    helpers.errorNotify(errorMsg);
                }
            } else {
                helpers.consoleLogWarning('All Good! W3 Validator Passed! :)', 'cyan');
                this.processStatus();
                // disable process.exit if run from gulp
                if (!this.gulpDone) {
                    process.exit(1);
                }
            }
        }
    },

    processStatus: function(start = false) {
        // label message to know when whole task started and ended
        const taskName = 'w3-validator';
        const msg = start ? `Starting '${colors.cyan(taskName)}'...` : `Finished '${colors.cyan(taskName)}'`;

        if (!start) {
            this.spinner.stop();
            this.bar.stop();
            this.barCount = 0;

            // run gulp done()
            if (this.gulpDone) {
                this.gulpDone();
            }
        }

        fancyLog(msg);
    }
};
