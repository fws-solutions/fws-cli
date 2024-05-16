import { getPackageMetadata } from '../package';
import { ICommand, IW3ValidatorOptions } from '../interfaces/interfaces';
import { setSpinner } from '../util/setSpinner';
import { w3cHtmlValidator } from '../util/w3c-html-validator.js';
import { getLogMessageInline } from '../util/getLogMessageInline';
import isUrl from 'is-url';

const w3validator: ICommand = {
    name: 'w3Validator',
    description: 'validate via w3 api',
    alias: 'w3',
    mandatoryOptions: [{ command: '-url, --url <url>', description: 'url, mandatory' }],
    async run(options: IW3ValidatorOptions) {
        const { url } = options;
        const packageMetadata = getPackageMetadata();
        if (!packageMetadata?.isValid) process.exit(1);

        const spinner = setSpinner('Checking... %s', '⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏');
        spinner.start();

        if (!isUrl(url)) {
            getLogMessageInline(`\nThe passed argument '${url}' is not an URL.`, 'red');
            spinner.stop();
            process.exit(1);
        }

        try {
            const results = await w3cHtmlValidator.validate({ website: url });
            spinner.stop();
            if (!results.validates) {
                getLogMessageInline('\n[w3c-html-validator] Validation failed:', 'red');
                w3cHtmlValidator.reporter(results, {
                    continueOnFail: true,
                    maxMessageLen: null,
                    quiet: false,
                    title: null,
                });
            } else {
                getLogMessageInline('[w3c-html-validator] Validation passed!', 'cyan');
            }
        } catch (error) {
            console.error('[w3c-html-validator] Error during validation:', error);
        }
    },
};

w3validator.run = w3validator.run.bind(w3validator);

export { w3validator };
