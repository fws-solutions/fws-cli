import { compileTemplate } from '../util/compileTemplate';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import _ from 'lodash';

jest.mock('fs');
jest.mock('lodash');

describe('util/compileTemplate - testing compile template', () => {
    const templateFile = 'exampleTemplate.ejs';
    const data = {
        str: 'value1',
        componentName: 'value2',
        componentClass: 'value3',
        componentSrc: 'value4',
        componentPrettyName: 'value5',
        componentPrettyNamePrefix: 'value6',
        componentWrapFluid: true,
    };

    let readFileSyncMock: jest.Mock;

    beforeEach(() => {
        jest.clearAllMocks();
        readFileSyncMock = jest.fn();

        (readFileSync as jest.Mock) = readFileSyncMock;
    });

    it('should read and compile the template with provided data', () => {
        const mockTemplateContent =
            '<%= str %> - <%= componentName %> - <%= componentClass %> - <%= componentSrc %> - <%= componentPrettyName %> - <%= componentPrettyNamePrefix %> - <%= componentWrapFluid %>';

        readFileSyncMock.mockReturnValue(mockTemplateContent);

        const templateSpy = jest.spyOn(_, 'template') as jest.Mock;
        templateSpy.mockReturnValue(jest.fn().mockReturnValue('compiledTemplateResult'));

        const result = compileTemplate(templateFile, data);

        expect(readFileSyncMock).toHaveBeenCalledWith(resolve('src/templates/other/', templateFile), 'utf8');
        expect(templateSpy).toHaveBeenCalledWith(mockTemplateContent);
        expect(result).toBe('compiledTemplateResult');
    });
});
