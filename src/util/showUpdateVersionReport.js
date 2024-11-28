import colors from 'ansi-colors';
import figlet from 'figlet';
import semver from 'semver';

export const showUpdateVersionReport = (currentVersion, latestVersion) => {
    const updateNeeded = semver.gt(latestVersion, currentVersion);
    const status = updateNeeded ? 'Update Needed!' : 'All Good!';

    figlet(status, { font: 'Small Slant' }, (err, data) => {
        if (err) {
            console.error('\nSomething went wrong...');
            console.error(err);
        } else {
            const message = `You${updateNeeded ? ' DO NOT' : ''} have the latest version of ${colors.magenta('@fws/cli')} installed!`;
            const report = `
${colors[updateNeeded ? 'red' : 'cyan'](data || '')}
${colors[updateNeeded ? 'red' : 'grey'](message)}\n
${colors.cyan(`Latest version: ${latestVersion || 'N/A'}`)}${colors[updateNeeded ? 'red' : 'cyan'](`Local version: ${currentVersion || 'N/A'}`)}
    `;
            console.log(report);
        }
    });
};
