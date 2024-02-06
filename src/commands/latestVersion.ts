import { getPackageMetadata } from '../package';
import { ICommand } from '../interfaces/interfaces';
import { getCurrentVersion } from '../util/getCurrentVersion';
import { getLatestVersion } from '../util/getLatestVersion';
import { checkUpdateVersion } from '../util/checkUpdateVersion';

const latestVersion: ICommand = {
    name: 'latest-version',
    description: 'check for latest CLI version',
    alias: 'latest',
    async run() {
        const packageMetadata = getPackageMetadata();
        if (!packageMetadata?.isValid) process.exit(1);

        const currentVersion = getCurrentVersion();
        const latestVersion = await getLatestVersion();
        checkUpdateVersion(currentVersion, latestVersion);
    },
};

latestVersion.run = latestVersion.run.bind(latestVersion);

export { latestVersion };
