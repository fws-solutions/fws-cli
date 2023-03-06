import BaseCommand from '../domain/Command/BaseCommand.js';
import fancyLog from 'fancy-log';
import colors from 'ansi-colors';
import StringHelpers from './StringHelpers.js';
import { spawn } from 'child_process';

export const registerCommands = async (
    commandsArray,
    currentPackage,
    program
) => {
    for (const com of commandsArray) {
        if (!com?.files?.length) continue;
        for (const file of com.files) {
            try {
                const filePath = `../../${com.type}/${file}`;
                const module = new (await import(filePath)).default();

                if (!(module instanceof BaseCommand))
                    throw new Error(
                        `This file is not a proper command: ${filePath}`
                    );

                const commandName = module.getDefinition().name;
                const mandatoryArguments = module
                    .getDefinition()
                    .hasMandatoryArguments()
                    ? module
                          .getDefinition()
                          .mandatoryArguments.map(
                              (parameter) => `<${parameter.name}>`
                          )
                          .reduce(
                              (accumulator, parameterName) =>
                                  `${accumulator} ${parameterName}`
                          )
                    : '';
                const optionalArguments = module
                    .getDefinition()
                    .hasOptionalArguments()
                    ? module
                          .getDefinition()
                          .mandatoryArguments.map(
                              (parameter) => `[${parameter.name}]`
                          )
                          .reduce(
                              (accumulator, parameterName) =>
                                  `${accumulator} ${parameterName}`
                          )
                    : '';
                const alias = module.getDefinition().hasAlias()
                    ? module.getDefinition().alias
                    : '';

                const command = program
                    .command(`${commandName}`)
                    .arguments(`${mandatoryArguments} ${optionalArguments}`);

                if (module.getDefinition().hasMandatoryOptions()) {
                    module
                        .getDefinition()
                        .mandatoryOptions.forEach((parameter) => {
                            const description = parameter.hasAvailableValues()
                                ? `${
                                      parameter.description
                                  } (choices: ${parameter.availableValues.join(
                                      ', '
                                  )})`
                                : parameter.description;
                            command.requiredOption(
                                `-${parameter.shortName}, --${parameter.name} ${
                                    parameter.flag ? '' : `<${parameter.name}>`
                                }`,
                                description
                            );
                        });
                }

                if (module.getDefinition().hasOptionalOptions()) {
                    module
                        .getDefinition()
                        .optionalOptions.forEach((parameter) => {
                            const description = parameter.hasAvailableValues()
                                ? `${
                                      parameter.description
                                  } (choices: ${parameter.availableValues.join(
                                      ', '
                                  )})`
                                : parameter.description;
                            command.option(
                                `-${parameter.shortName}, --${parameter.name} ${
                                    parameter.flag ? '' : `[${parameter.name}]`
                                }`,
                                description
                            );
                        });
                }

                command
                    .description(module.getDefinition().description)
                    .action(async () => {
                        const args = command.args;

                        if (module.getDefinition().hasMandatoryArguments()) {
                            let inboundMandatoryArguments = [];
                            inboundMandatoryArguments = args.slice(
                                0,
                                module.getDefinition().mandatoryArguments.length
                            );
                            for (
                                let index = 0;
                                index < inboundMandatoryArguments.length;
                                index++
                            ) {
                                module
                                    .getDefinition()
                                    .mandatoryArguments[index].setValue(
                                        inboundMandatoryArguments[index]
                                    );
                            }
                            args.splice(
                                0,
                                module.getDefinition().mandatoryArguments.length
                            );
                        }

                        if (module.getDefinition().hasOptionalArguments()) {
                            const inboundOptionalArguments = args || [];
                            for (
                                let index = 0;
                                index < inboundOptionalArguments.length;
                                index++
                            ) {
                                module
                                    .getDefinition()
                                    .optionalArguments[index].setValue(
                                        inboundOptionalArguments[index]
                                    );
                            }
                        }

                        module
                            .getDefinition()
                            .mandatoryOptions.forEach((parameter) => {
                                parameter.setValue(
                                    command[
                                        StringHelpers.dashCaseToCamelCase(
                                            parameter.name
                                        )
                                    ]
                                );
                            });

                        module
                            .getDefinition()
                            .optionalOptions.forEach((parameter) => {
                                if (
                                    command.hasOwnProperty(
                                        StringHelpers.dashCaseToCamelCase(
                                            parameter.name
                                        )
                                    )
                                )
                                    parameter.setValue(
                                        command[
                                            StringHelpers.dashCaseToCamelCase(
                                                parameter.name
                                            )
                                        ]
                                    );
                            });

                        if (!module.getDefinition().isStandAlone)
                            module.showStartMessage();

                        module.validateInputParameters();
                        await module.run();
                        if (!module.getDefinition().isStandAlone)
                            module.showEndMessage();
                    })
                    .alias(alias);
            } catch (exception) {
                fancyLog(colors.red(exception));
                process.exit(1);
            }
        }
        if (currentPackage) {
            const packageJson = currentPackage.getPackageJson();
            for (const command in packageJson.scripts) {
                if (command === 'postinstall') continue;
                program
                    .command(`${command}`)
                    .description(`${packageJson.scripts[command]}`)
                    .action(() => {
                        const script = spawn(
                            /^win/.test(process.platform) ? 'npm.cmd' : 'npm',
                            ['run', command],
                            {
                                stdio: 'inherit',
                                cwd: currentPackage.getProjectRoot(),
                            }
                        );
                        script.on('close', (code) => {
                            process.exit(code);
                        });
                    });
            }
        }
    }
};
