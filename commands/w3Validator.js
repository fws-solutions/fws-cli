import CommandDefinition from "../base/domain/Command/CommandDefinition.js";
import BaseCommand from "../base/domain/Command/BaseCommand.js";
import isUrl from 'is-url'
import validator from 'html-validator';
import forOwn from 'lodash.forown'
import axios from 'axios'
import colors from "ansi-colors";
import ArgumentDefinition from "../base/domain/Parameter/ArgumentDefinition.js";

export default class W3Validator extends BaseCommand {
    _pageCount = 0;
    _errorCount = 0;
    _errorReport = '';
    _barCount = 0;
    _urlAddress;

    constructor() {
        super(
            new CommandDefinition('w3Validator', 'validate via w3 api')
                .setMandatoryParameters(
                    new ArgumentDefinition('url'),
                )
                .setAlias('w3')
        );
    }

    async run() {
        this._setUrlAddress()
            ._validateUrlAddress()
            .setSpinner('Loading WP REST API... %s')
            .startSpinner();
        await this._validatePages(
            await this._getPages(
                await this._getPostTypes()
            )
        );
        this._endProcess();
    }

    _setUrlAddress() {
        this._urlAddress = this.getParameter('url') === 'local'
            ? process.env.VIRTUAL_HOST_URL
            : this.getParameter('url');
        return this;
    }

    _validateUrlAddress() {
        if (!isUrl(this._urlAddress)) {
            this.inlineLogError(`The passed argument '${this._urlAddress}' is not an URL.`);
            this.showEndMessage();
        }
        return this;
    }

    async _getPostTypes() {
        try {
           const types = await axios.get(`${this._urlAddress}/wp-json/wp/v2/types`);
           let filteredTypes = [`${this._urlAddress}/wp-json/wp/v2/pages?per_page=100`];
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
           if (exception.code === 'ENOTFOUND') this.inlineLogError(`The URL '${this._urlAddress}' that you are trying to reach is unavailable or wrong.`);
           else {
               if (exception.response && exception.response.status && exception.response.statusText)
                   this.inlineLogError(`Error ${exception.response.status}: ${exception.response.statusText}!
                                   W3 Validator couldn't scan URL '${this._urlAddress}'.
                                   Please check if this URL is a WP site and if 'wp-json' routes are available.`);
               else this.inlineLogError(exception);
           }
           this.showEndMessage();
       }
    }

    async _getPages(postTypes) {
        const pages = [];
        try {
            for (let postType in postTypes) {
                const response = await axios.get(postTypes[postType]);

                if (typeof response.data === 'object' && response.data.length > 0){
                    response.data.forEach((page)=>{
                        if (!page.link.includes('spec-sheet-pdf')) pages.push(page.link);
                    })
                }
            }
        } catch (exception) {
            this.stopSpinner();
            this.inlineLogError(exception);
            this.showEndMessage();
        }
        return pages;
    }

    async _validatePages(pages) {
        this.startProgressBar(pages.length, 0);
        for (let i = 0; i < pages.length; i++) {
             await this._validateHtml(pages[i]);
        }
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
            this.inlineLogError(exception);
        }
    }

    _endProcess() {
        this.stopProgressBar();
        console.log(this._errorReport);

        if (this._pageCount < 1) this.consoleLogSuccess('All Good! W3 Validator Passed! :)');
        else this.consoleLogWarning(`Found ${this._errorCount} errors, on ${this._pageCount} pages!`);
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
