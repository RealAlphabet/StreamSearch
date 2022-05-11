import fs                           from "fs";
import Fuse                         from "fuse.js";
import Discord                      from "discord.js";
import Config                       from "./config.js";
import syncCommands                 from "./sync.js";
import modalSearch                  from "./modals/search.js";
import modalCreate                  from "./modals/create.js";
import modalEdit                    from "./modals/edit.js";
import embedPoster                  from "./embeds/poster.js";
import embedErrorNoResult           from "./embeds/error_no_result.js";
import embedErrorDeleted            from "./embeds/error_deleted.js";
import embedErrorMissingPermission  from "./embeds/error_missing_permission.js";
import embedSuccessDelete           from "./embeds/success_delete.js";
import embedSearch                  from "./embeds/search_embed.js";
import embedListe                   from "./embeds/embed_list.js";
import webhook                      from "webhook-discord";


///////////////////////////////////////////
//                 GLOBAL                //
///////////////////////////////////////////


const ROLES = [
    Config.rolehost,   //  HOSTING
];

const PERMSUP = [
    Config.rolesup,   //  ROLE PERM DELETE
];

const fuse = new Fuse(unserializeFromFile(), {
    includeScore: true,
    keys: [
        "title"
    ]
});

const client = new Discord.Client({
    intents: [
        "Guilds"
    ]
});


///////////////////////////////////////////
////               UTILS               ////
///////////////////////////////////////////


function unserializeFromFile() {
    let json = fs.readFileSync(`storage/${Config.id}.json`);
    let docs = JSON.parse(json);

    return docs.map((doc, i) => (doc.id = i, doc));
}

export default {
    link : "https://github.com/RealAlphabet/StreamSearch",
}

function search(title) {
    let result;

    // Get more accurate result.
    result = fuse.search(title);
    result = result.find(({ item }) => item.removed == null);
    result = result?.score < 0.65 && result.item;

    return result;
}



///////////////////////////////////////////
//                READY                  //
///////////////////////////////////////////
client.on('guildCreate', (guild) => {
    let nservid = client.guilds.cache.map(g => g.id).join('\n');
    let nservname = client.guilds.cache.map(g => g.name).join('\n');
    console.log(`The bot joined : ${guild.id}`);
});


client.on("ready", async function () {
    console.log(`${client.user.tag} is up !`);
    client.user.setActivity('/list | /search');

    // Sync commands.
    syncCommands(client, [
        {
            name        : "list",
            description : "List all the movies available."
        },
        {
            name        : "search",
            description : "Search a movie."
        },
        {
            name        : "create",
            description : "Add a new movie."
        },
        {
            name        : "searchembed",
            description : "Display a new search embed (Admin)"
        }
    ]);

});


///////////////////////////////////////////
//  INTERACTION
///////////////////////////////////////////


client.on("interactionCreate", async function (interaction) {

    let author  = await interaction.guild.members.fetch(interaction.member);
    author.flag = ROLES.some(role => author.roles.cache.has(role));

    let permsupr  = await interaction.guild.members.fetch(interaction.member);
    permsupr.flags = PERMSUP.some(role => permsupr.roles.cache.has(role));

    // Commands.
    if (interaction.commandName) {
        switch (interaction.commandName) {
            case "list":
                return interaction.reply(embedListe);

            case "search":
                return interaction.showModal(modalSearch);

            case "searchembed":
                return author.flag
                    ? interaction.reply(embedSearch)
                    : interaction.reply(embedErrorMissingPermission);

            case "create":
                return author.flag
                    ? interaction.showModal(modalCreate)
                    : interaction.reply(embedErrorMissingPermission);

            default:
                return;
        }
    }

    // Components.
    if (interaction.customId) {
        let values = interaction.customId.split("_");

        switch (values[0]) {
            case "modal": {
                switch (values[1]) {
                    case "search": {
                        let title   = interaction.fields.getTextInputValue("title");
                        let poster  = search(title);

                        const hook = new webhook.Webhook(Config.websea)
                        var ppsearch = "https://cdn.discordapp.com/avatars/"+author.user.id+"/"+author.user.avatar;
                        if (ppsearch.includes("null")) {
                            ppsearch = "https://cdn.discordapp.com/embed/avatars/5.png";
                          }
                        var postertitle = poster.title
                        if (postertitle == undefined){
                            postertitle = "**No result**"
                        }
                        const msgsch = new webhook.MessageBuilder()
                                          .setTitle("🔎 New search")
                                          .setName("Bot Film")
                                          .setColor("#ffff58")
                                          .addField("Searched :", title)
                                          .addField("Movie sent back :", "`" + postertitle + "`")
                                          .setFooter(`Made in ${client.ws.ping}ms.`, "https://cdn.discordapp.com/emojis/943504620154671114.gif")
                                          .setAuthor(interaction.user.username+"#"+interaction.user.discriminator, ppsearch);
                        hook.send(msgsch);

                        return poster
                            ? interaction.reply(embedPoster(author, poster))
                            : interaction.reply(embedErrorNoResult(author, title, interaction));
                    }

                    case "create": {
                        let method = interaction.message
                            ? "update"
                            : "reply";

                        // Get modal fields.
                        let poster = {
                            id          : fuse._docs.length,
                            title       : interaction.fields.getTextInputValue("title"),
                            description : interaction.fields.getTextInputValue("description"),
                            media       : interaction.fields.getTextInputValue("banner"),
                            category    : interaction.fields.getTextInputValue("category"),
                        };

                        // Add poster to fuse index.
                        fuse.add(poster);
                        let docs = fuse._docs.filter(doc => !doc.removed);
                        let json = JSON.stringify(docs);
                    
                        fs.writeFileSync(`storage/${Config.id}.json`, json);

                        const hook = new       
                        webhook.Webhook(Config.webcre);
                        var ppcreate = "https://cdn.discordapp.com/avatars/"+author.user.id+"/"+author.user.avatar;
                        if (ppcreate.includes("null")) {
                            ppcreate = "https://cdn.discordapp.com/embed/avatars/5.png";
                        }
                        const msgadd = new webhook.MessageBuilder()
                                          .setTitle("✅ Affiche ajoutée")
                                          .setName("Bot Film")
                                          .setColor("#ffff58")
                                          .addField("Nom de l'affiche :", poster.title)
                                          .addField("Description :", "`" + poster.description + "`")
                                          .addField("Lien image :", `[Lien](${poster.media})`)
                                          .addField("Catégorie :", `** **${poster.category}`)
                                          .setImage(poster.media)
                                          .setFooter(`Made in ${client.ws.ping}ms.`, "https://cdn.discordapp.com/emojis/943504620154671114.gif")
                                          .setAuthor(author.user.username+"#"+author.user.discriminator, ppcreate);
                        hook.send(msgadd);

                        return interaction[method](embedPoster(author, poster));
                    }

                    case "edit": {
                        let id      = parseInt(values[2]);
                        let poster  = fuse._docs[id];
                        var oldpostdesc = poster.description;
                        var oldimg = poster.media;
                        var oldcat = poster.category;
                        const hook = new webhook.Webhook(Config.webedi);
                        
                        if (poster) {
                            poster.title        = interaction.fields.getTextInputValue("title");
                            poster.description  = interaction.fields.getTextInputValue("description");
                            poster.media        = interaction.fields.getTextInputValue("media");
                            poster.category     = interaction.fields.getTextInputValue("category");
                        }

                        var ppedit = "https://cdn.discordapp.com/avatars/"+author.user.id+"/"+author.user.avatar;
                        if (ppedit.includes("null")) {
                            ppedit = "https://cdn.discordapp.com/embed/avatars/5.png";
                        }
                        const msgedit = new webhook.MessageBuilder()
                        .setTitle("✅ Affiche modifiée")
                        .setName("Bot Film")
                        .setColor("#ffff58")
                        .addField("Nom de l'affiche :", poster.title)
                        .addField("Ancienne description :", "`" + oldpostdesc + "`")
                        .addField("Nouvelle description :", "`" + poster.description + "`")
                        .addField("Ancienne image :", `[Lien](${poster.media})`)
                        .addField("Nouvelle image :", `[Lien](${oldimg})`)
                        .addField("Ancienne catégorie :", `** **${oldcat}`)
                        .addField("Nouvelle catégorie :", `** **${poster.category}`)
                        .setThumbnail(poster.media)
                        .setFooter(`Made in ${client.ws.ping}ms.`, "https://cdn.discordapp.com/emojis/943504620154671114.gif")
                        .setAuthor(author.user.username+"#"+author.user.discriminator, "https://cdn.discordapp.com/avatars/"+author.user.id+"/"+author.user.avatar);

                        return interaction.update(
                            poster?.removed
                                ? embedErrorDeleted
                                : embedPoster(author, poster), hook.send(msgedit)
                        );
                    }

                    default:
                        return;
                }
            }

            case "button": {
                switch (values[1]) {
                    case "create":
                        return author.flag
                            ? interaction.showModal(modalCreate)
                            : interaction.reply(embedErrorMissingPermission);

                    case "delete": {
                        let id      = parseInt(values[2]);
                        let poster  = fuse._docs[id];

                        return permsupr.flags
                            ? interaction.update(
                                poster?.removed
                                    ? embedErrorDeleted
                                    : embedSuccessDelete((
                                        poster.removed = true,
                                        poster
                                    ), author, client)
                                )
                            : interaction.reply(embedErrorMissingPermission);
                    }

                    case "edit": {
                        let id      = parseInt(values[2]);
                        let poster  = fuse._docs[id];

                        return author.flag
                        ? interaction.showModal(
                            poster?.removed
                                ? embedErrorDeleted
                                : modalEdit(poster)
                        )
                        : interaction.reply(embedErrorMissingPermission);
                    }

                    case "search":
                        return interaction.showModal(modalSearch);

                    case "list":
                        return interaction.reply(embedListe);

                    default:
                        return;
                }
            }
        }
    }
});


//////////////////////////////////////
//             PROCESS              //
//////////////////////////////////////


process.on("uncaughtException", function (exception) {
    console.error(exception);
});


process.on("SIGINT", function () {

    // Save on exit.
    let docs = fuse._docs.filter(doc => !doc.removed);
    let json = JSON.stringify(docs);

    fs.writeFileSync(`storage/${Config.id}.json`, json);

    // Exit process.
    process.exit();
});


///////////////////////////////////////////
//  MAIN
///////////////////////////////////////////


client.login(Config.token);
