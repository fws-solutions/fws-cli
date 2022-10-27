import CommandDefinition from "../base/domain/Command/CommandDefinition.js";
import BaseCommand from "../base/domain/Command/BaseCommand.js";

export default class W3Validator extends BaseCommand {
    constructor() {
        super(
            new CommandDefinition('w3Validator', 'w3Validator description')
                .setMandatoryParameters('url')
                // .setOptionalParameters('optional1', 'optional2')
        );
    }

    run(url) {
        this.url = url;
    }
}
