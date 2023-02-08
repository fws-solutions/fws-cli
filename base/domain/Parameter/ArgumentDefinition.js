// List of reserved names which cannot be used to define 'commander' options
export const ARGUMENT_RESERVED_NAMES = [
    // Unknown reserved names at the moment. Extend the list if necessary.
];
export default class ArgumentDefinition {
    _name;
    _description = '';
    _availableValues;
    _value;

    constructor(name) {
        if (ARGUMENT_RESERVED_NAMES.includes(name)) throw new Error(`Trying to use a reserved name for the argument parameter: ${name}`);
        this._name = name;
    }

    get name() {
        return this._name;
    }

    get description() {
        return this._description;
    }

    setDescription(value) {
        this._description = value;
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
