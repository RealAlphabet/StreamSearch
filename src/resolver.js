import Discord from "discord.js";


//////////////////////////////////////
//  UTILS
//////////////////////////////////////


String.prototype.contains = function (queries) {

    // Check if string contains one of queries.
    for (let query of queries)
        if (this.includes(query))
            return true;

    return false;
};


//////////////////////////////////////
//  RESOLVER
//////////////////////////////////////


export default {
    resolveColor            : Discord.Util.resolveColor,
    resolveEmoji            : Discord.Util.parseEmoji,
    resolveButtonStyle      : Discord.EnumResolvers.resolveButtonStyle,
    resolveChannelType      : Discord.EnumResolvers.resolveChannelType,
    resolvePermissionType   : Discord.EnumResolvers.resolveApplicationCommandPermissionType
}
