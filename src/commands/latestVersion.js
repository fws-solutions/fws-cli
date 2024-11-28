// import { getPackageMetadata } from '../package';
import { getCurrentVersion } from '../util/getCurrentVersion.js';
import { getLatestVersion } from '../util/getLatestVersion.js';
import { showUpdateVersionReport } from '../util/showUpdateVersionReport.js';
import { setSpinner } from '../util/setSpinner.js';
import semver from 'semver';
import { getLogMessageInline } from '../util/getLogMessageInline.js';

const latestVersion = {
    name: 'latest-version',
    description: 'check for latest CLI version',
    alias: 'latest',
    async run() {
        const spinner = setSpinner('%s ...checking latest @forwardslashny/fws-cli version...', '⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏');
        spinner.start();

        const currentVersion = getCurrentVersion();
        const latestVersion = await getLatestVersion();

        if (!semver.valid(currentVersion) || !semver.valid(latestVersion)) {
            getLogMessageInline('\nInvalid version format detected!', 'red');
            throw new Error('Invalid version format detected!', 1);
        }

        showUpdateVersionReport(currentVersion, latestVersion);
        spinner.stop();
    },
};

latestVersion.run = latestVersion.run.bind(latestVersion);

export { latestVersion };
