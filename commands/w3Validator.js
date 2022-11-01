import CommandDefinition from "../base/domain/Command/CommandDefinition.js";
import BaseCommand from "../base/domain/Command/BaseCommand.js";
import isUrl from 'is-url'
import validator from 'html-validator';
import forOwn from 'lodash.forown'
import axios from 'axios'
import colors from "ansi-colors";

export default class W3Validator extends BaseCommand {
    _pageCount = 0;
    _errorCount = 0;
    _errorReport = '';
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
        this._validateUrlAddress();
        this._validatePages();
    }

    _validateUrlAddress() {
        if (!isUrl(this.url)) {
            this.inlineLogError(`The passed argument '${this.url}' is not an URL.`);
            this.showEndMessage();
        }
    }

    async _getPostTypes() {
       try {
           const types = await axios.get(`${this.url}/wp-json/wp/v2/types`);
           let filteredTypes = [`${this.url}/wp-json/wp/v2/pages?per_page=100`];

           forOwn(types.data, function(value) {
               // exclude unneeded types
               if (value.slug !== 'attachment' && value.slug !== 'wp_block' && value.slug !== 'page'
                   && value.slug !== 'nav_menu_item' && value.slug !== 'wp_template' && value.slug !== 'wp_template_part' ) {
                   filteredTypes.push(`${value['_links']['wp:items'][0]['href']}?per_page=10`);
               }
           });
           return filteredTypes;

       } catch (exception) {
           this.stopSpinner();
           if (exception.code === 'ENOTFOUND') this.inlineLogError(`The URL '${this.url}' that you are trying to reach is unavailable or wrong.`);
           else {
               if (exception.response && exception.response.status && exception.response.statusText)
                   this.inlineLogError(`Error ${exception.response.status}: ${exception.response.statusText}!
                                   W3 Validator couldn't scan URL '${this.url}'.
                                   Please check if this URL is a WP site and if 'wp-json' routes are available.`);
               else this.inlineLogError(exception);
           }
           this.showEndMessage();
       }
    }

    async _getPages() {
        let promises = [];
        const types = await this._getPostTypes();

        // send request for each rest api endpoint
        forOwn(types, (value)=> {
            promises.push(axios.get(value));
        });

        return Promise.all(promises)
            .then((values) => {
                return values.reduce((pages, object) => {
                    if (typeof object.data === 'object' && object.data.length > 0) {
                        object.data.forEach(cur => {
                            if (!cur.link.includes('spec-sheet-pdf')) pages.push(cur.link);
                        });
                    }
                    return pages;
                }, []);
            })
            .catch(exception => {
                this.stopSpinner();
                this.inlineLogError(exception);
                this.showEndMessage();
            });
    }

    async _validatePages() {
        this.startSpinner();
        const pages = await this._getPages();
        this.startProgressBar(pages.length, 0);

        for (let i = 0; i < pages.length; i++) {
            await this._validateHtml(pages[i]);
        }

        this._endProcess();
    }

    async _validateHtml(page) {
        // get validator configuration
        const config = this._configValidator(page);

        try {
            let counter = 0;
            let validatorResults = await validator(config);
            this.updateProgressBar(++this._barCount);

            if (!validatorResults.includes('There were errors.')) return;
            validatorResults = validatorResults.replace('\n' + 'There were errors.' + '').split('\n');

            this._errorReportMessage(`\n\n### W3 Validator Error on Page: ${page}\n\n`, 'cyan');

            validatorResults.forEach((value, index)=>{
                ++this._errorCount;
                if (index % 2 !== 0) this._errorReportMessage(`\n    Location: ${value}\n\n`, 'yellow');
                else  this._errorReportMessage(`--- No.#${++counter} --------------------------------------------------------------\`)}\n    ${colors.red(value)}`, 'cyan');
            });

            ++this._pageCount;

        } catch (exception) {
            this.stopSpinner();
            this.inlineLogError(exception)
        }
    }

    _endProcess() {
        this.stopProgressBar();
        console.log(this._errorReport);

        if (this._pageCount < 1) this.consoleLogSuccess('All Good! W3 Validator Passed! :)');
        else this.consoleLogWarning(`Found ${this._errorCount} errors, on ${this._pageCount} pages!`);

        this.showEndMessage();
    }

    _errorReportMessage(message, color) {
        this._errorReport += colors[color](message);
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
