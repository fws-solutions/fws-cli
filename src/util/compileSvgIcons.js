import { readdirSync } from 'fs';
import { basename } from 'path';
import _startCase from 'lodash.startcase';
import _template from 'lodash.template';

export const compileSvgIcons = (compiledImportSrc, svgDirPath) => {
    const compiledImport = _template(`    import <%= componentName %> from '${compiledImportSrc}';\n`);
    const compiledComponent = _template('            <%= componentName %>,\n');
    let importStrings = '';
    let componentsStrings = '';

    readdirSync(svgDirPath).forEach((file) => {
        const name = basename(file, '.svg');
        const componentName = _startCase(name.replace('ico-', '')).replace(/ /g, '');

        importStrings += compiledImport({
            fileName: name,
            componentName,
        });

        componentsStrings += compiledComponent({
            componentName,
        });
    });

    return {
        impStrings: importStrings,
        compStrings: componentsStrings,
    };
};
