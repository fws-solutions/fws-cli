import CommandDefinition from "../base/domain/Command/CommandDefinition.js";
import BaseCommand from "../base/domain/Command/BaseCommand.js";

export default class Svg extends BaseCommand {
    constructor() {
        super(
            new CommandDefinition('svg', 'SVG Description')
                .setMandatoryParameters('mandatory1', 'mandatory2')
                .setOptionalParameters('optional1')
        );
    }

    run(mandatory1, mandatory2, optional1) {
        console.log(mandatory1, mandatory2, optional1);
    }
}
