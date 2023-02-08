import OptionDefinition from "../Parameter/OptionDefinition.js";
import ArgumentDefinition from "../Parameter/ArgumentDefinition.js";

export default class CommandDefinition {
    _mandatoryOptions = [];
    _optionalOptions = [];
    _mandatoryArguments = [];
    _optionalArguments = [];
    _name;
    _description;
    _alias;

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

    get mandatoryArguments() {
        return this._mandatoryArguments;
    }

    hasMandatoryArguments() {
        return this._mandatoryArguments.length > 0;
    }

    get mandatoryOptions() {
        return this._mandatoryOptions;
    }

    hasMandatoryOptions() {
        return this._mandatoryOptions.length > 0;
    }

    setMandatoryParameters(...parameters) {
        parameters.forEach((parameter) => {
            if (parameter instanceof OptionDefinition) this._mandatoryOptions.push(parameter);
            else if (parameter instanceof ArgumentDefinition) this._mandatoryArguments.push(parameter);
            else throw new Error(`Trying to inject something else instead of OptionDefinition or ArgumentDefinition for mandatory command parameter!`);
        });
        return this;
    }

    get optionalArguments() {
        return this._optionalArguments;
    }

    hasOptionalArguments() {
        return this._optionalArguments.length > 0;
    }

    get optionalOptions() {
        return this._optionalOptions;
    }

    hasOptionalOptions() {
        return this._optionalOptions.length > 0;
    }

    setOptionalParameters(...parameters) {
        parameters.forEach((parameter) => {
            if (parameter instanceof OptionDefinition) this._optionalOptions.push(parameter);
            else if (parameter instanceof ArgumentDefinition) this._optionalArguments.push(parameter);
            else throw new Error(`Trying to inject something else instead of OptionDefinition or ArgumentDefinition for optional command parameter!`);
        });
        return this;
    }
}
