export const PACKAGE_TYPES = {
    fws_starter_s: {
        type: 'wp',
        allowedCommands: [
            'create-file',
            'remove-fe',
            'icons',
            'latest-version',
            'npmci',
            'npmi',
            'postinstall',
            'w3Validator',
        ],
    },
    fws_starter_vue: {
        type: 'vue',
        allowedCommands: ['create-file', 'icons', 'latest-version', 'npmci', 'npmi', 'w3Validator'],
    },
    fws_starter_nuxt: {
        type: 'nuxt',
        allowedCommands: ['create-file', 'icons', 'latest-version', 'npmci', 'npmi', 'postinstall', 'w3Validator'],
    },
    fws_starter_next: {
        type: 'next',
        allowedCommands: ['create-file', 'latest-version', 'npmci', 'npmi', 'w3Validator'],
    },
    fws_global: {
        type: 'global',
        allowedCommands: ['latest-version'],
    },
};
