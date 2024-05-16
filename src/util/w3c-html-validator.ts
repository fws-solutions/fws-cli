//! w3c-html-validator v1.6.4 ~~ https://github.com/center-key/w3c-html-validator ~~ MIT License

import fs from 'fs';
import log from 'fancy-log';
import request from 'superagent';
import slash from 'slash';
import colors from 'ansi-colors';

export type ValidatorSettings = {
    html?: string;
    filename?: string;
    website?: string;
    checkUrl?: string;
    ignoreLevel?: 'info' | 'warning' | null;
    ignoreMessages?: (string | RegExp)[];
    output?: ValidatorResultsOutput;
};

export type ValidatorResultsMessage = {
    type: 'info' | 'error' | 'non-document-error' | 'network-error';
    subType?: 'warning' | 'fatal' | 'io' | 'schema' | 'internal';
    message: string;
    extract: string;
    lastLine: number;
    firstColumn: number;
    lastColumn: number;
    hiliteStart: number;
    hiliteLength: number;
};

export type ValidatorResultsMessageType = ValidatorResultsMessage['type'];
export type ValidatorResultsMessageSubType = ValidatorResultsMessage['subType'];

export type ValidatorResults = {
    validates: boolean;
    mode: 'html' | 'filename' | 'website';
    title: string;
    html: string | null;
    filename: string | null;
    website: string | null;
    output: 'json' | 'html';
    status: number;
    messages: ValidatorResultsMessage[] | null;
    display: string | null;
};

export type ValidatorResultsOutput = ValidatorResults['output'];
export type ReporterSettings = {
    continueOnFail: boolean;
    maxMessageLen: number | null;
    quiet: boolean;
    title: string | null;
};

const w3cHtmlValidator = {
    version: '1.6.4',
    async validate(options: Partial<ValidatorSettings>): Promise<ValidatorResults> {
        const defaults: ValidatorSettings = {
            checkUrl: 'https://validator.w3.org/nu/',
            ignoreLevel: null,
            ignoreMessages: [],
            output: 'json',
        };

        const settings: ValidatorSettings = { ...defaults, ...options };

        if (!settings.html && !settings.filename && !settings.website)
            throw Error('[w3c-html-validator] Must specify the "html", "filename", or "website" option.');

        if (![null, 'info', 'warning'].includes(settings.ignoreLevel as string | null))
            throw Error('[w3c-html-validator] Invalid ignoreLevel option: ' + settings.ignoreLevel);

        if (settings.output !== 'json' && settings.output !== 'html')
            throw Error('[w3c-html-validator] Option "output" must be "json" or "html".');

        const filename = settings.filename ? slash(settings.filename) : null;
        const mode = settings.html ? 'html' : filename ? 'filename' : 'website';

        const readFile = (filename: string): string => fs.readFileSync(filename, 'utf-8').replace(/\r/g, '');
        const inputHtml = settings.html ?? (filename ? readFile(filename) : null);

        const makePostRequest = () => {
            if (typeof inputHtml === 'string') {
                return request
                    .post(settings.checkUrl as string)
                    .set('Content-Type', 'text/html; encoding=utf-8')
                    .send(inputHtml);
            } else {
                throw new Error('[w3c-html-validator] Invalid HTML input provided.');
            }
        };

        const makeGetRequest = () => request.get(settings.checkUrl as string).query({ doc: settings.website });

        const w3cRequest = inputHtml ? makePostRequest() : makeGetRequest();
        w3cRequest.set('User-Agent', 'W3C HTML Validator ~ github.com/center-key/w3c-html-validator');
        w3cRequest.query({ out: settings.output });

        const json = settings.output === 'json';
        const success = '<p class="success">';

        const titleLookup = {
            html: 'HTML String (characters: ' + (inputHtml?.length ?? 0) + ')',
            filename: filename,
            website: settings.website,
        };

        const filterMessages = (response: request.Response): request.Response => {
            const aboveInfo = (subType: string) => settings.ignoreLevel === 'info' && !!subType;
            const aboveIgnoreLevel = (message: ValidatorResultsMessage) =>
                !settings.ignoreLevel || message.type !== 'info' || aboveInfo(message.subType as string);
            const matchesSkipPattern = (title: string) =>
                (settings.ignoreMessages ?? []).some((pattern) =>
                    typeof title === 'string' && typeof pattern === 'string'
                        ? title.includes(pattern)
                        : pattern instanceof RegExp && typeof title === 'string'
                          ? pattern.test(title)
                          : false
                );

            const isImportant = (message: ValidatorResultsMessage) =>
                aboveIgnoreLevel(message) && !matchesSkipPattern(message.message);

            if (json) response.body.messages = response.body.messages?.filter(isImportant) ?? [];
            return response;
        };
        const toValidatorResults = (response: any): ValidatorResults => ({
            validates: json ? !response.body.messages.length : !!response.text?.includes(success),
            mode: mode as 'html' | 'filename' | 'website',
            title: titleLookup[mode] || '',
            html: inputHtml,
            filename: filename,
            website: settings.website || null,
            output: settings.output as 'json' | 'html',
            status: response.statusCode || -1,
            messages: json ? response.body.messages : null,
            display: json ? null : response.text,
        });

        const handleError = (reason: any): ValidatorResults => {
            const response = reason.response;
            const getMsg = () => [response.status, response.res.statusMessage, response.request.url];
            const message = response ? getMsg() : [reason.errno, reason.message];
            const errRes = response ?? {};
            errRes.body = { messages: [{ type: 'network-error', message: message.join(' ') }] };
            return toValidatorResults(errRes);
        };

        return w3cRequest.then(filterMessages).then(toValidatorResults).catch(handleError);
    },

    summary(numFiles: number): void {
        log(colors.gray('w3c-html-validator'), colors.magenta('files: ' + numFiles));
    },

    reporter(results: ValidatorResults, options?: Partial<ReporterSettings>): ValidatorResults {
        const defaults: ReporterSettings = {
            continueOnFail: false,
            maxMessageLen: null,
            quiet: false,
            title: null,
        };

        const settings: ReporterSettings = { ...defaults, ...options };

        if (typeof results?.validates !== 'boolean')
            throw Error(colors.red.bold('[w3c-html-validator] Invalid results for reporter(): ' + String(results)));

        const messages = results.messages ?? [];
        const title = settings.title ?? results.title;
        const status = results.validates ? colors.green.bold('✔ pass') : colors.red.bold('✘ fail');
        const count = results.validates ? '' : '(messages: ' + messages.length + ')';

        if (!results.validates || !settings.quiet)
            log(colors.gray('w3c-html-validator'), status, colors.blue.bold(title), colors.white(count));

        const typeColorMap = {
            error: colors.red.bold,
            warning: colors.yellow.bold,
            info: colors.green.bold,
        };

        const logMessage = (message: ValidatorResultsMessage): void => {
            const type = message.subType ?? message.type;
            const typeColor = (typeColorMap[type as keyof typeof typeColorMap] ?? colors.red.bold) as any;
            const location = `line ${message.lastLine}, column ${message.firstColumn}:`;
            const lineText = message.extract?.replace(/\n/g, '\\n');
            const maxLen = settings.maxMessageLen ?? undefined;

            log(typeColor('HTML ' + type + ':'), message.message.substring(0, maxLen));
            if (message.lastLine) log(colors.white(location), colors.magenta(lineText));
        };

        messages.forEach(logMessage);

        const failDetails = (): string => {
            const toString = (message: ValidatorResultsMessage): string =>
                `${message.subType ?? message.type} line ${message.lastLine} column ${message.firstColumn}`;

            if (!results.filename) {
                return results.messages?.[0]?.message || 'Unknown error';
            } else {
                return results.filename + ' -- ' + (results.messages?.map(toString).join(', ') || 'No messages');
            }
        };

        if (!settings.continueOnFail && !results.validates)
            throw Error(colors.red.bold('[w3c-html-validator] Failed: ' + failDetails()));

        return results;
    },
};

export { w3cHtmlValidator };
