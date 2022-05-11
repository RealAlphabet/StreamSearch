import Resolver from "../resolver.js";
import fs       from "fs";
import Fuse     from "fuse.js";
import Config   from "../config.js";


///////////////////////////////////////////
//  EMBED : search_embed
///////////////////////////////////////////
function unserializeFromFile() {
    let json = fs.readFileSync(`storage/${Config.id}.json`);
    let docs = JSON.parse(json);

    return docs.map((doc, i) => (doc.id = i, doc));
}

const fuse = new Fuse(unserializeFromFile(), {
    includeScore: true,
    keys: [
        "title"
    ]
});

var lstval = fuse._docs.map(a => { return a.title; }).length;


export default {
    embeds: [
        {
            title       : "🎥 Movies",
            description : `${lstval} movies are available on this bot.`,
            fields: [
                {
                    name: '🔎 Search for a movie',
                    value: "Click on this button to search for a movie.",
                    inline: false,
                },
                {
                    name: "🤔 Not available ?",
                    value: 'Ask for it on the server!',
                    inline: false,
                },
            ],
        
            color       : Resolver.resolveColor("Red"),
            custom_id   : "searchEmbed",
        }
    ],
    components: [
        {
            type: 1,
            components:[
                {
                    type        : 2,
                    style       : Resolver.resolveButtonStyle("LINK"),
                    label       : "📜 Movies list",
                    url         : Config.chlist
                },
                {
                    type        : 2,
                    style       : Resolver.resolveButtonStyle("SUCCESS"),
                    label       : "🔎 Search for a movie",
                    custom_id   : "button_search"
                },
                {
                    type        : 2,
                    style       : Resolver.resolveButtonStyle("LINK"),
                    label       : "Suggérer un nouveau film",
                    url         : Config.chsugg,
                    disabled    : false
                }
    ]
        }
    ]
}