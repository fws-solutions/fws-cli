import { readFileSync } from 'fs';
import { resolve } from 'path';
import _ from 'lodash';

export const compileTemplate = (templateFile, data) => {
    const appRoot = import.meta.dirname.split('src')[0];
    const template = readFileSync(resolve(`${appRoot}src/templates/other/`, templateFile), 'utf8');
    return _.template(template)(data);
};
