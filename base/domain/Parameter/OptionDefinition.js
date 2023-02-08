// List of reserved names which cannot be used to define 'commander' options
export const OPTION_RESERVED_NAMES = [
    'name'
];
export default class OptionDefinition {
    _name;
    _shortName;
    _description = '';
    _isFlag = false;
    _availableValues;
    _value;

    constructor(shortName, name) {
        this._shortName = shortName;
        if (OPTION_RESERVED_NAMES.includes(name)) throw new Error(`Trying to use a reserved name for the option parameter: ${name}`);
        this._name = name;
    }

    get name() {
        return this._name;
    }

    get shortName() {
        return this._shortName;
    }

    get description() {
        return this._description;
    }

    setDescription(value) {
        this._description = value;
        return this;
    }

    isFlag() {
        this._isFlag = true;
        return this;
    }

    get flag() {
        return this._isFlag;
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
        if (this._isFlag && this._value === undefined) return false;
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
