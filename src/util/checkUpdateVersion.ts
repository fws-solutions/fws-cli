import colors from 'ansi-colors';
import figlet from 'figlet';
import semver from 'semver';

export const checkUpdateVersion = (currentVersion: string, latestVersion: string): void => {
    if (semver.valid(currentVersion) === null || semver.valid(latestVersion) === null) {
        console.error('Invalid version format detected!');
        process.exit(1);
    }
    const updateNeeded = semver.gt(latestVersion, currentVersion);
    const status = updateNeeded ? 'Update Needed!' : 'All Good!';

    figlet(status, { font: 'Small Slant' }, (err, data) => {
        if (err) {
            console.error('Something went wrong...');
            console.error(err);
            process.exit(1);
        }

        const message = `You${updateNeeded ? ' DO NOT' : ''} have the latest version of ${colors.magenta('@fws/cli')} installed!`;
        const report = `
${colors[updateNeeded ? 'red' : 'cyan'](data || '')}
${colors[updateNeeded ? 'red' : 'grey'](message)}\n
${colors.cyan(`Latest version: ${latestVersion || 'N/A'}`)}${colors[updateNeeded ? 'red' : 'cyan'](`Local version: ${currentVersion || 'N/A'}`)}
`;

        console.log(report);
        process.exit(updateNeeded ? 1 : 0);
    });
};
