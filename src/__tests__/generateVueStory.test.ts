import { generateVueStory } from '../util/generateVueStory';
import { writeFileSync } from 'fs';
import { compileTemplate } from '../util/compileTemplate';
import { getVueStoryTempAndDir } from '../util/getVueStoryTempAndDir';
import { ROLL_BACK } from '../consts/rollBack';
import { getLogMessageInline } from '../util/getLogMessageInline';
import { resolve } from 'path';
import { IPackageMetadata } from '../interfaces/interfaces';

jest.mock('fs');
jest.mock('../util/compileTemplate');
jest.mock('../util/getVueStoryTempAndDir');
jest.mock('../util/getLogMessageInline');

describe('util/generateVueStory - testing Vue story generation', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should generate the Vue story file correctly for "part" dirType', () => {
        const packageMetadata: IPackageMetadata = {
            packageType: 'nuxt',
            projectRoot: '/path/to/project',
            packageJsonDir: '',
            assetsDir: '',
            packageJson: null,
            isValid: true,
        };
        const componentName = 'ExampleComponent';
        const dirType = 'part';
        const fileName = 'exampleComponent';

        const vueStoryTempAndDir = {
            temp: 'path/to/template.stories.js',
            dir: 'stories',
        };
        (getVueStoryTempAndDir as jest.Mock).mockReturnValue(vueStoryTempAndDir);

        const compiledTemplate = '<template>...</template>';
        (compileTemplate as jest.Mock).mockReturnValue(compiledTemplate);

        generateVueStory(packageMetadata, componentName, dirType, fileName);

        const expectedFilePath = resolve('/path/to/project', 'stories', `2-ExampleComponent.stories.js`);
        expect(writeFileSync).toHaveBeenCalledWith(expectedFilePath, compiledTemplate, 'utf8');

        expect(ROLL_BACK.files).toContain(expectedFilePath);
        expect(getLogMessageInline).toHaveBeenCalledWith(
            `New story part "2-ExampleComponent.stories.js" is created!`,
            'cyan'
        );
    });

    it('should generate the Vue story file correctly for "block" dirType', () => {
        const packageMetadata: IPackageMetadata = {
            packageType: 'nuxt',
            projectRoot: '/path/to/project',
            packageJsonDir: '',
            assetsDir: '',
            packageJson: null,
            isValid: true,
        };
        const componentName = 'ExampleComponent';
        const dirType = 'block';
        const fileName = 'exampleComponent';

        const vueStoryTempAndDir = {
            temp: 'path/to/template.stories.js',
            dir: 'stories',
        };
        (getVueStoryTempAndDir as jest.Mock).mockReturnValue(vueStoryTempAndDir);

        const compiledTemplate = '<template>...</template>';
        (compileTemplate as jest.Mock).mockReturnValue(compiledTemplate);

        generateVueStory(packageMetadata, componentName, dirType, fileName);

        const expectedFilePath = resolve('/path/to/project', 'stories', `3-ExampleComponent.stories.js`);
        expect(writeFileSync).toHaveBeenCalledWith(expectedFilePath, compiledTemplate, 'utf8');

        expect(ROLL_BACK.files).toContain(expectedFilePath);
        expect(getLogMessageInline).toHaveBeenCalledWith(
            `New story block "3-ExampleComponent.stories.js" is created!`,
            'cyan'
        );
    });

    it('should handle error and throw exception', () => {
        (writeFileSync as jest.Mock).mockImplementation(() => {
            throw new Error('Error writing file');
        });

        const packageMetadata: IPackageMetadata = {
            packageType: 'nuxt',
            projectRoot: '/path/to/project',
            packageJsonDir: '',
            assetsDir: '',
            packageJson: null,
            isValid: true,
        };

        expect(() => generateVueStory(packageMetadata, 'ExampleComponent', 'part', 'exampleComponent')).toThrowError(
            'Error writing file'
        );

        expect(ROLL_BACK.files).toHaveLength(2);
        expect(getLogMessageInline).not.toHaveBeenCalled();
    });
});
