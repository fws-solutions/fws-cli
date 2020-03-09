/**
 * W3 Validation
 *
 * @description Validate domain via W3 API.
 */

const fancyLog = require('fancy-log');
const colors = require('ansi-colors');
const axios = require('axios');
const validator = require('html-validator');
const helpers = require('../helpers');
const isUrl = require('is-url');

function ValidatorConfig(url) {
    this.url = url;
    this.format = 'text';
    //this.isLocal = true;
    this.ignore = [
        'Warning: The "type" attribute is unnecessary for JavaScript resources.'
    ];
}
//http://asl.local/wp-json/wp/v2/types
module.exports = {
    validateCount: 0,

    init: function(url) {
        if (isUrl(url)) {
            this.getPages(url);
        }
    },

    getPages: async function (url) {
        const pagesURL = `${url}/wp-json/wp/v2/pages?per_page=100`;
        const postsURL = `${url}/wp-json/wp/v2/product?per_page=5`;

        try {
            const pages = await axios.get(pagesURL);
            const posts = await axios.get(postsURL);
            const all = pages.data.concat(posts.data);

            all.forEach((cur, i, a) => {
                this.validateHTML(cur.link, i, a);
            });
        } catch (error) {
            console.error(error);
        }
    },

    validateHTML: async function(url, i, a) {
        const config = new ValidatorConfig(url);

        try {
            let counter = 0;
            let result = await validator(config);
            const hasErrorsString = 'There were errors.';

            if (result.includes(hasErrorsString)) {
                result = result.replace('\n' + hasErrorsString, '').split('\n');

                await console.log('\n\n');
                await console.log(colors.cyan(`########## W3 Validator Error on Page: ${url} ##########`));
                await console.log('\n');

                result.forEach((cur, i) => {
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

            this.cancelProcess(++this.validateCount, a.length);
        } catch (error) {
            console.error(error);
        }
    },

    cancelProcess: function(validateCount, totalCount) {
        if (validateCount === totalCount) {
            process.exit(1);
        }
    }
};
