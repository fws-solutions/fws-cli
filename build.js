import fs from 'node:fs/promises';
import path from 'node:path';
const templatePath = path.resolve('./src/templates');
const destTemplatePath = path.resolve('./dist/templates');

(async () => {
    try {
        await fs.mkdir(destTemplatePath, { recursive: true });
        await fs.cp(templatePath, destTemplatePath, { recursive: true });

        console.log('Successfully copied templates to ./dist/templates/');
    } catch (error) {
        console.error('Error copying templates to ./dist/templates/');
        console.error(error);
    }
})();
