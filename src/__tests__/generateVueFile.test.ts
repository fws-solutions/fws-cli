import { generateVueFile } from '../util/generateVueFile';
import { writeFileSync } from 'fs';
import { compileTemplate } from '../util/compileTemplate';
import { getVueComponentTemplate } from '../util/getVueComponentTemplate';
import { ROLL_BACK } from '../consts/rollBack';
import { getLogMessageInline } from '../util/getLogMessageInline';

jest.mock('fs');
jest.mock('../util/compileTemplate');
jest.mock('../util/getVueComponentTemplate');
jest.mock('../util/getLogMessageInline');

describe('util/generateVueFile - testing Vue file generation', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should generate the Vue file correctly', () => {
        const packageType = 'nuxt';
        const componentName = 'ExampleComponent';
        const fileName = 'exampleComponent';
        const filePath = '/path/to/project/src/components/ExampleComponent.vue';

        const templateFile = 'path/to/template.vue';
        const compiledTemplate = '<template>...</template>';

        (getVueComponentTemplate as jest.Mock).mockReturnValue(templateFile);
        (compileTemplate as jest.Mock).mockReturnValue(compiledTemplate);

        generateVueFile(packageType, componentName, fileName, filePath);

        expect(writeFileSync).toHaveBeenCalledWith(filePath, compiledTemplate, 'utf8');

        expect(ROLL_BACK.files).toContain(filePath);

        expect(getLogMessageInline).toHaveBeenCalledWith(`New component "ExampleComponent.vue" is created!`, 'cyan');
    });

    it('should handle error and throw exception', () => {
        (writeFileSync as jest.Mock).mockImplementation(() => {
            throw new Error('Error writing file');
        });

        expect(() =>
            generateVueFile(
                'nuxt',
                'ExampleComponent2',
                'exampleComponent2',
                '/path/to/project/src/components/ExampleComponent2.vue'
            )
        ).toThrowError('Error writing file');

        expect(ROLL_BACK.files).toHaveLength(1);
        expect(getLogMessageInline).not.toHaveBeenCalled();
    });
});
