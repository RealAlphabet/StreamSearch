import Config   from "../config.js";
import fs       from "fs";
import Fuse     from "fuse.js"
import Resolver from "../resolver.js";

const fuse = new Fuse(unserializeFromFile(), {
    includeScore: true,
    keys: [
        "title"
    ]
});

function unserializeFromFile() {
    let json = fs.readFileSync(`storage/${Config.id}.json`);
    let docs = JSON.parse(json);

    return docs.map((doc, i) => (doc.id = i, doc));
}

var listres = fuse._docs.map(a => { return a.title; }).sort().join("\n");

export default {
    ephemeral: true,
    embeds: [
        {
            title       : "🔍 Movie list",
            color       : Resolver.resolveColor("Yellow"),
            thumbnail: {
                url: Config.icon,
            },        
            description : "📌 Here is the list of the movies available on the server. \n \n ✨ Use **`/search`** to find them.",
            fields      : [
                {
                    name: '** **',
                    value: listres.substring(0, 1024),
                    inline: true,
                },
                {
                    name: '** **',
                    value: listres.substring(1024, 2048),
                    inline: true,
                },
                {
                    name: '** **',
                    value: listres.substring(2048, 3072),
                    inline: true,
                },
            ],                
        },
    ],
    components: [
        {
            type: 1,
            components:[
                {
                    type        : 2,
                    style       : Resolver.resolveButtonStyle("DANGER"),
                    label       : "🔎 Search for a movie",
                    custom_id   : "button_search"
                }
    ]
        }

    ]
};
