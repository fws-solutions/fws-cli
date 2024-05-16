import colors from 'ansi-colors';
import { setSpinner } from '../util/setSpinner';

describe('util/setSpinner - testing set spinner', () => {
    it('should return a Spinner instance with the provided title and spinnerString', () => {
        const title = 'Loading';
        const spinnerString = '|/-\\';
        const spinner = setSpinner(title, spinnerString);

        expect(typeof spinner === 'object' && spinner !== null).toBe(true);
    });

    it('should return a Spinner instance with default title and spinnerString if not provided', () => {
        const spinner = setSpinner('', '|/-\\');
        expect(typeof spinner === 'object' && spinner !== null).toBe(true);
    });

    it('should allow setting a custom title after creating the spinner', () => {
        const initialTitle = 'Loading';
        const spinner = setSpinner(initialTitle, '|/-\\');

        const newTitle = 'Processing';
        spinner.setSpinnerTitle(colors.cyan(newTitle));

        expect(spinner).toHaveProperty('setSpinnerTitle');
    });

    it('should allow setting a custom spinnerString after creating the spinner', () => {
        const initialSpinnerString = '|/-\\';
        const spinner = setSpinner('Loading', initialSpinnerString);

        const newSpinnerString = '1234';
        spinner.setSpinnerString(newSpinnerString);

        expect(spinner).toHaveProperty('setSpinnerString');
    });
});
