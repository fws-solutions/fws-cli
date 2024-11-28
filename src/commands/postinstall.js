import { getPackageMetadata } from '../package/index.js';
import { resolve } from 'path';
import { copyEnvFile } from '../util/copyEnvFile.js';
import { getEnvTemplate } from '../util/getEnvTemplate.js';

const postInstall = {
    name: 'postinstall',
    description: 'runs postinstall script',
    alias: 'pi',
    run() {
        const packageMetadata = getPackageMetadata();
        if (!packageMetadata?.isValid) throw new Error(`Script: postinstall failed with code: 1`);

        const message = packageMetadata.packageType === 'wp' ? 'theme directory' : 'Nuxt project';

        const env = resolve(packageMetadata.projectRoot, '.env');
        const exampleEnv = resolve(packageMetadata.projectRoot, '.env.example');
        const envTemplate = getEnvTemplate(packageMetadata.packageType);

        copyEnvFile(envTemplate, exampleEnv, message, '.env-example');
        copyEnvFile(envTemplate, env, message, '.env');
    },
};

postInstall.run = postInstall.run.bind(postInstall);

export { postInstall };
