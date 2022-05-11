import Resolver    from "../resolver.js";
import webhook     from "webhook-discord";
import Config      from "../config.js";

///////////////////////////////////////////
//  EMBED : SUCCESS DELETE
///////////////////////////////////////////


export default function (poster, author, client) {

    const hook = new webhook.Webhook(Config.webdel);

    var ppdel = "https://cdn.discordapp.com/avatars/"+author.user.id+"/"+author.user.avatar;
    if (ppdel.includes("null")) {
        ppdel = "https://cdn.discordapp.com/embed/avatars/5.png";
    }

    const msgsuppr = new webhook.MessageBuilder()
                    .setTitle("🗑️ Movie deleted")
                    .setName("Bot Film")
                    .setColor("#ffff58")
                    .addField("Nom de l'affiche :", poster.title)
                    .addField("Description : ", "`" + poster.description + "`")
                    .addField("Image :", `[Lien](${poster.media})`)
                    .setFooter(`Éxecuté en ${client.ws.ping}ms.`, "https://cdn.discordapp.com/emojis/943504620154671114.gif")
                    .setAuthor(author.user.username+"#"+author.user.discriminator, ppdel);
    hook.send(msgsuppr);
  
    return {
        ephemeral: true,
        embeds: [
            {
                title       : "Wow!",
                description : `The movie \`${poster.title}\` was deleted.`,
                color       : Resolver.resolveColor("Green")
            },
        ],
        components: []
    };
}

