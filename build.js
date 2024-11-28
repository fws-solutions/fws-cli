import fs from 'node:fs/promises';
import path from 'node:path';
const templatePath = path.resolve('./src/templates');
const destTemplatePath = path.resolve('./dist/src/templates');

(async () => {
    try {
        await fs.mkdir(destTemplatePath, { recursive: true });
        await fs.cp(templatePath, destTemplatePath, { recursive: true });

        console.log('Successfully copied templates to ./dist/src/templates');
    } catch (error) {
        console.error('Error copying templates to ./dist/src/templates');
        console.error(error);
    }
})();
