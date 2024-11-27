import fs from 'node:fs/promises';
import path from 'node:path';

const hookPath = path.resolve('./hooks/pre-commit');
const gitHookPath = path.resolve('./.git/hooks/pre-commit');

(async () => {
    try {
        await fs.copyFile(hookPath, gitHookPath);
        console.log('Successfully copied pre-commit hook to .git/hooks');
    } catch (error) {
        console.error('Error copying pre-commit hook to .git/hooks');
        console.error(error);
    }
})();
