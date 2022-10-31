import BaseCommand from "../base/domain/Command/BaseCommand.js";
import CommandDefinition from "../base/domain/Command/CommandDefinition.js";

export default class StarterNext extends BaseCommand {
    constructor() {
        super(
            new CommandDefinition('starter-next', 'Initializes a NextJS project from scratch.')
                .setMandatoryParameters('project-name')
        );
    }

    run(projectName) {
        console.log(projectName);

        // clone https://github.com/fws-solutions/starter_next.git to the current directory
        // rename the directory to the project name
        // remove .git from the project root
        // inject the package name into package.json - fws_starter_next
    }
}
