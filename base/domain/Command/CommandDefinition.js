export default class CommandDefinition {
    _mandatoryParameters = [];
    _optionalParameters = [];
    _name;
    _description;

    constructor(name, description) {
        this._name = name;
        this._description = description;
    }

    get name() {
        return this._name;
    }

    get description() {
        return this._description;
    }

    get mandatoryParameters() {
        return this._mandatoryParameters;
    }

    hasMandatoryParameters() {
        return this._mandatoryParameters.length > 0;
    }

    setMandatoryParameters(...value) {
        this._mandatoryParameters = value;
        return this;
    }

    get optionalParameters() {
        return this._optionalParameters;
    }

    hasOptionalParameters() {
        return this._optionalParameters.length > 0;
    }

    setOptionalParameters(...value) {
        this._optionalParameters = value;
        return this;
    }
}
