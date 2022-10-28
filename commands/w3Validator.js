import CommandDefinition from "../base/domain/Command/CommandDefinition.js";
import BaseCommand from "../base/domain/Command/BaseCommand.js";
import isUrl from 'is-url'
import forOwn from 'lodash.forown'
import axios from 'axios'

export default class W3Validator extends BaseCommand {
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
                   this.consoleLogError(`Error ${exception.response.status}: ${exception.response.statusText}! \n
                                         W3 Validator couldn't scan URL '${this.url}'. \n
                                         Please check if this URL is a WP site and if 'wp-json' routes are available.`);
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
}
