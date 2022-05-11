import Discord from "discord.js";


///////////////////////////////////////////
//  SYNC
///////////////////////////////////////////


export default async function (client, commands, guildId) {
    const currentCommands   = await client.application.commands.fetch({ guildId });
    const newCommands       = commands.filter((command) => !currentCommands.some((c) => c.name === command.name));
    const deletedCommands   = currentCommands.filter((command) => !commands.some((c) => c.name === command.name)).toJSON();
    const updatedCommands   = commands.filter((command) => currentCommands.some((c) => c.name === command.name));
    let updatedCommandCount = 1;

    for (let newCommand of newCommands)
        await client.application.commands.create(newCommand, guildId);

    for (let deletedCommand of deletedCommands)
        await deletedCommand.delete();

    for (let updatedCommand of updatedCommands) {
        const newCommand = updatedCommand;
        const previousCommand = currentCommands.find((c) => c.name === updatedCommand.name);
        let modified = false;
        if (previousCommand.description !== newCommand.description) modified = true;
        if (!Discord.ApplicationCommand.optionsEqual(previousCommand.options ?? [], newCommand.options ?? [])) modified = true;
        if (modified) {
            await previousCommand.edit(newCommand);
            updatedCommandCount++;
        }
    }

    return {
        currentCommandCount     : currentCommands.size,
        newCommandCount         : newCommands.length,
        deletedCommandCount     : deletedCommands.length,
        updatedCommandCount
    };
}
