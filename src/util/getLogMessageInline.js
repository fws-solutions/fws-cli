import fancyLog from 'fancy-log';
import colors from 'ansi-colors';

export const getLogMessageInline = (message, color) => {
    fancyLog(colors[color](message));
};
