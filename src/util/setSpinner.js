import Spinner from 'cli-spinner';
import colors from 'ansi-colors';

export const setSpinner = (title, spinnerString) => {
    const spinner = new Spinner.Spinner(colors.cyan(title));
    spinner.setSpinnerString(spinnerString);

    return spinner;
};
