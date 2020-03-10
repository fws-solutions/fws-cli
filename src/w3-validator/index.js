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

// constructor for validator's config object
function ValidatorConfig(url) {
    this.url = url;
    this.format = 'text';
    //this.isLocal = true;
    this.ignore = [
        'Warning: The "type" attribute is unnecessary for JavaScript resources.'
    ];
}

module.exports = {
    validateCount: 0,
    errorCount: 0,
    pageCount: 0,

    init: function(url) {
        this.progressLabel(true);

        // check if passed argument is an url
        if (isUrl(url)) {
            this.getPostTypes(url);
        } else {
            this.progressLabel();
            helpers.consoleLogWarning(`The passed argument '${url}' is not an URL.`, 'red', true);
        }
    },

    getPostTypes: async function(url) {
        // get endpoints for all wp post types
        try {
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
                this.progressLabel();
                helpers.consoleLogWarning(`The URL '${url}' that you are trying to reach is unavailable or wrong.`, 'red', true);
            } else {
                console.error(error);
                this.progressLabel();
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
                        agg.push(cur.link);
                    });
                }

                return agg;
            }, []);

            // send filtered urls for validation
            _this.checkURLs(allURLs);
        }).catch(error => {
            console.error(error);
            this.progressLabel();
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
        const config = new ValidatorConfig(url);

        try {
            let counter = 0;
            let result = await validator(config);
            const hasErrorsString = 'There were errors.';

            // check if results have errors
            if (result.includes(hasErrorsString)) {
                result = result.replace('\n' + hasErrorsString, '').split('\n');

                helpers.consoleLogWarning(`W3 Validator Error on Page: ${url}`, 'cyan');

                // count pages that have errors
                ++this.pageCount;

                result.forEach((cur, i) => {
                    // count errors
                    ++this.errorCount;

                    if (i % 2 !== 0) {
                        fancyLog(colors.yellow(`Location: ${cur}`));
                        fancyLog(colors.cyan('-----------------------------------------------------'));
                        console.log('\n');
                    } else {
                        counter++;
                        fancyLog(colors.cyan(`No.#${counter} -----------------------------------------------`));
                        fancyLog(colors.red(cur));
                    }
                });
            }

            // count when last Validator promise is done and stop the script
            this.cancelProcess(++this.validateCount, a.length);
        } catch (error) {
            console.error(error);
            this.progressLabel();
            helpers.consoleLogWarning(error.message, 'red', true);
        }
    },

    cancelProcess: function(validateCount, totalCount) {
        if (validateCount === totalCount) {
            if (this.pageCount > 0) {
                this.progressLabel();
                helpers.consoleLogWarning(`Found ${this.errorCount} errors, on ${this.pageCount} pages!`, 'red', true);
            } else {
                helpers.consoleLogWarning('All Good! No Errors Found! :)', 'cyan');
                this.progressLabel();
                process.exit(1);
            }
        }
    },

    progressLabel: function(start = false) {
        // label message to know when whole task started and ended
        const msg = start ? 'W3 Start' : 'W3 End';
        fancyLog(colors.cyan(msg));
    }
};
