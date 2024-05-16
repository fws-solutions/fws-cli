interface IRollBack {
    files: Array<string>;
    directories: Array<string>;
}

export const ROLL_BACK: IRollBack = {
    files: [],
    directories: [],
};
