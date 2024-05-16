import { readFileSync } from 'fs';
import { resolve } from 'path';
import { ITemplateData } from '../interfaces/interfaces';
import _ from 'lodash';

export const compileTemplate = (templateFile: string, data: ITemplateData): string => {
    const appRoot = __dirname.split('src')[0];
    const template = readFileSync(resolve(`${appRoot}src/templates/other/`, templateFile), 'utf8');
    return _.template(template)(data);
};
