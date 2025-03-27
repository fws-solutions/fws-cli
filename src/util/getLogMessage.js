import fancyLog from 'fancy-log';
import colors from 'ansi-colors';
import _template from 'lodash.template';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

export const getLogMessage = (message, color) => {
    const appRoot = dirname(fileURLToPath(import.meta.url)).split('src')[0] ?? '';
    const template = readFileSync(`${appRoot}src/templates/other/temp-cli-log.txt`, 'utf8');
    const compiled = _template(template);
    fancyLog(colors[color](compiled({ message: message })));
};
