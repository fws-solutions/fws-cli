import ParameterDefinition from "../Parameter/ParameterDefinition.js";

export default class CommandDefinition {
    _mandatoryParameters = [];
    _optionalParameters = [];
    _name;
    _description;
    _alias;
    _isStandAlone = false;

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

    get alias() {
        return this._alias;
    }

    hasAlias() {
        return this._alias !== undefined;
    }

    setAlias(value) {
        this._alias = value;
        return this;
    }

    get mandatoryParameters() {
        return this._mandatoryParameters;
    }

    hasMandatoryParameters() {
        return this._mandatoryParameters.length > 0;
    }

    setMandatoryParameters(...parameters) {
        parameters.forEach((parameter) => {
            if (!(parameter instanceof ParameterDefinition)) throw new Error(`Trying to inject something else instead of ParameterDefinition for mandatory command parameter!`);
        });
        this._mandatoryParameters = parameters;
        return this;
    }

    get optionalParameters() {
        return this._optionalParameters;
    }

    hasOptionalParameters() {
        return this._optionalParameters.length > 0;
    }

    setOptionalParameters(...parameters) {
        parameters.forEach((parameter) => {
            if (!(parameter instanceof ParameterDefinition)) throw new Error(`Trying to inject something else instead of ParameterDefinition for optional command parameter!`);
        });
        this._optionalParameters = parameters;
        return this;
    }

    get isStandAlone() {
        return this._isStandAlone;
    }

    setIsStandAlone(value) {
        this._isStandAlone = value;
        return this;
    }
}
