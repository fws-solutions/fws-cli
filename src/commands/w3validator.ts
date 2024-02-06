import { getPackageMetadata } from '../package';
import { ICommand, IW3ValidatorOptions } from '../interfaces/interfaces';

const w3validator: ICommand = {
    name: 'w3Validator',
    description: 'validate via w3 api',
    alias: 'w3',
    mandatoryOptions: [{ command: '-url, --url <url>', description: 'url, mandatory' }],
    run(options: IW3ValidatorOptions) {
        const { url } = options;
        console.log('running w3 validator command', url);
        const packageMetadata = getPackageMetadata();
        console.log(packageMetadata);
    },
};

w3validator.run = w3validator.run.bind(w3validator);

export { w3validator };
