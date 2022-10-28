import CommandDefinition from "../base/domain/Command/CommandDefinition.js";
import BaseCommand from "../base/domain/Command/BaseCommand.js";
import isUrl from 'is-url'
import validator from 'html-validator';
import forOwn from 'lodash.forown'
import axios from 'axios'
import colors from "ansi-colors";

export default class W3Validator extends BaseCommand {
    _pageCount;
    _errorCount;
    _errorReport;
    _barCount = 0;

    constructor() {
        super(
            new CommandDefinition('w3Validator', 'w3Validator description')
                .setMandatoryParameters('url')
        );
    }

    run(url) {
        this.url = url;
        this.showStartMessage();
        this._checkUrlAddress();
        this._validatePages();
    }

    _checkUrlAddress() {
        if (!isUrl(this.url)) {
            this.showEndMessage();
            this.consoleLogError(`The passed argument '${this.url}' is not an URL.`);
        }
    }

    async _getPostTypes() {
       try {
           this.startSpinner();
           const types = await axios.get(`${this.url}/wp-json/wp/v2/types`);
           let filteredTypes = [`${this.url}/wp-json/wp/v2/pages?per_page=100`];

           forOwn(types.data, function(value) {
               // exclude unneeded types
               if (value.slug !== 'attachment' && value.slug !== 'wp_block' && value.slug !== 'page') {
                   filteredTypes.push(`${value['_links']['wp:items'][0]['href']}?per_page=10`);
               }
           });
           return filteredTypes;

       } catch (exception) {
           this.stopSpinner();
           this.showEndMessage();
           if (exception.code === 'ENOTFOUND') this.consoleLogError(`The URL '${this.url}' that you are trying to reach is unavailable or wrong.`);
           else {
               if (exception.response && exception.response.status && exception.response.statusText)
                   this.consoleLogError(`Error ${exception.response.status}: ${exception.response.statusText}! \n    W3 Validator couldn't scan URL '${this.url}'. \n    Please check if this URL is a WP site and if 'wp-json' routes are available.`);
               else this.consoleLogError(exception);
           }
       }
    }

    async _getPages() {
        let promises = [];
        const types = await this._getPostTypes();

        // send request for each rest api endpoint
        forOwn(types, async (value)=> {
            promises.push(axios.get(value));
        });

        return Promise.all(promises)
            .then(async (values) => {
                const allPages = await values.reduce((pages, object) => {
                    if (object.data.length > 0) {
                        object.data.forEach(cur => {
                            if (!cur.link.includes('spec-sheet-pdf')) pages.push(cur.link);
                        });
                    }
                    return pages;
                }, []);
                this.stopSpinner();

                return allPages;
            })
            .catch(exception => {
                this.stopSpinner();
                this.consoleLogError(exception)
            });
    }

    async _validatePages() {
        const pages = await this._getPages();
        this.startProgressBar(pages.length, 0);

        // loop through all urls
        pages.forEach((url) => {
            this._validateHtml(url);
        });
    }

    async _validateHtml(url) {
        // get validator configuration
        const config = this._configValidator(url);
        this.updateProgressBar(++this._barCount);

        try {
            let counter = 0;
            let validatorResults = await validator(config);

            if (!validatorResults.includes('There were errors.')) return;

            validatorResults = validatorResults.replace('\n' + 'There were errors.' + '').split('\n');

            this._errorReportMessage(`\n\n### W3 Validator Error on Page: ${url}\n\n`, 'cyan');

            validatorResults.forEach((value, index)=>{
                ++this._errorCount;
                if (index % 2 !== 0) this._errorReportMessage(`\n    Location: ${value}\n\n`, 'yellow');
                else  this._errorReportMessage(`--- No.#${++counter} --------------------------------------------------------------\`)}\n    ${colors.red(value)}`, 'cyan');
            });

            ++this._pageCount;

            console.log(this._errorReport);
        } catch (exception) {
            this.stopSpinner();
            this.consoleLogError(exception)
        }
    }

    _errorReportMessage(message, color) {
        this._errorReport += colors[color](message);
    }

    _detectEndProcess() {
        if (!this._pageCount > 0) {
            this.consoleLogSuccess('All Good! W3 Validator Passed! :)');
        }

        this.inlineLogError(`Found ${this._errorCount} errors, on ${this._pageCount} pages!`);
        console.log(this._errorReport);
    }

    _configValidator(url) {
       return {
            url: url,
            format: 'text',
            ignore : [
                'Warning: The "type" attribute is unnecessary for JavaScript resources.',
                'Error: Attribute “item-id” not allowed on element “div” at this point.',
                'Error: End tag “br”.',
            ]
        };
    }
}
