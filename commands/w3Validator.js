import CommandDefinition from "../base/domain/Command/CommandDefinition.js";
import BaseCommand from "../base/domain/Command/BaseCommand.js";

export default class W3Validator extends BaseCommand {
    constructor() {
        super(
            new CommandDefinition('w3Validator', 'w3Validator description')
                .setMandatoryParameters('mandatory1')
                .setOptionalParameters('optional1', 'optional2')
        );
    }

    run(mandatory1, optional1, optional2) {
        console.log(mandatory1, optional1, optional2);
    }
}
