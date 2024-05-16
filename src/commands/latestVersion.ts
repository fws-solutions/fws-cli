// import { getPackageMetadata } from '../package';
import { ICommand } from '../interfaces/interfaces';
import { getCurrentVersion } from '../util/getCurrentVersion';
import { getLatestVersion } from '../util/getLatestVersion';
import { showUpdateVersionReport } from '../util/showUpdateVersionReport';
import { setSpinner } from '../util/setSpinner';
import semver from 'semver';
import { getLogMessageInline } from '../util/getLogMessageInline';

const latestVersion: ICommand = {
    name: 'latest-version',
    description: 'check for latest CLI version',
    alias: 'latest',
    async run() {
        const spinner = setSpinner('%s ...checking latest @fws/cli version...', '⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏');
        spinner.start();

        const currentVersion = getCurrentVersion();
        const latestVersion = await getLatestVersion();

        if (!semver.valid(currentVersion) || !semver.valid(latestVersion)) {
            getLogMessageInline('\nInvalid version format detected!', 'red');
            process.exit(1);
        }

        showUpdateVersionReport(currentVersion, latestVersion);
        spinner.stop();
    },
};

latestVersion.run = latestVersion.run.bind(latestVersion);

export { latestVersion };
