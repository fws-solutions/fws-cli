import { ICommand } from '../interfaces/interfaces';
import { getPackageMetadata } from '../package';

const icons: ICommand = {
    name: 'icons',
    description: 'optimizes and generates SVG icons',
    alias: 'ic',
    run() {
        console.log('running icons command');
        const packageMetadata = getPackageMetadata();
        console.log(packageMetadata);
        // TODO: finish icons command
    },
};

icons.run = icons.run.bind(icons);

export { icons };
