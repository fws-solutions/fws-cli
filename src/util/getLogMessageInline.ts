import fancyLog from 'fancy-log';
import colors from 'ansi-colors';

export const getLogMessageInline = (message: string, color: 'red' | 'yellow' | 'cyan'): void => {
    fancyLog(colors[color](message));
};
