const fs = require('node:fs/promises');
const hookPath = './hooks/pre-commit';
const gitHookPath = './.git/hooks/pre-commit';

(async () => {
    try {
        await fs.copyFile(hookPath, gitHookPath);
        console.log('Successfully copied pre-commit hook to .git/hooks');
    } catch (error) {
        console.error('Error copying pre-commit hook to .git/hooks');
        console.error(error);
    }
})();
