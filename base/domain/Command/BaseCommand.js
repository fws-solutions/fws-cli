import CommandDefinition from "./CommandDefinition.js";

export default class BaseCommand {
    _definition;
    constructor(definition) {
        if (!(definition instanceof CommandDefinition)) throw new Error('Missing command definition!')
        this._definition = definition;
    }

    getDefinition() {
        return this._definition;
    }
}
