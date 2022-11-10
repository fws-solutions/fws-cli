export default class ParameterDefinition {
    _name;
    _shortName;
    _availableValues;
    _value;

    constructor(name) {
        this._name = name;
    }

    get name() {
        return this._name;
    }

    get shortName() {
        return this._shortName;
    }

    hasShortName() {
        return this._shortName !== undefined;
    }

    setShortName(value) {
        this._shortName = value;
        return this;
    }

    get availableValues() {
        return this._availableValues;
    }

    hasAvailableValues() {
        return this._availableValues !== undefined;
    }

    setAvailableValues(value) {
        this._availableValues = value;
        return this;
    }

    get value() {
        return this._value;
    }

    hasValue() {
        return this._value !== undefined;
    }

    setValue(value) {
        this._value = value;
        return this;
    }
}
