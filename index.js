const w3Validator = require('./src/w3-validator');

module.exports = {
    w3: w3Validator.init.bind(w3Validator)
};
