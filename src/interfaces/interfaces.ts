interface IOptions {
    command: string;
    description?: string;
}

export interface ICreateFilesOptions {
    fileName: string;
    block: boolean;
    listing: boolean;
    part: boolean;
    blockVue: boolean;
    partVue: boolean;
}

export interface IW3ValidatorOptions {
    url: string;
}
export interface ICommand {
    name: string;
    description: string;
    alias?: string;
    mandatoryOptions?: Array<IOptions>;
    additionalOptions?: Array<IOptions>;
    run(options: ICreateFilesOptions | IW3ValidatorOptions | null): void;
}

export interface IOption {
    command: string;
    description?: string;
}

export interface IPackageMetadata {
    projectRoot: string;
    packageJsonDir: string;
    assetsDir: string;
    packageType: string;
    packageJson: Record<string, string> | null;
    isValid: boolean;
}

export interface ITemplateData {
    str?: string;
    componentName?: string;
    componentClass?: string;
    componentSrc?: string;
    componentPrettyName?: string;
    componentPrettyNamePrefix?: string;
    componentWrapFluid?: boolean;
}

export interface IVueStoryTempAndDir {
    temp: string;
    dir: string;
}

export interface ISvgIconData {
    dir: string;
    svgIconFile: string;
    compiledImportSrc: string;
    templateFile: string;
}

export interface ISvgCompile {
    impStrings: string;
    compStrings: string;
}
