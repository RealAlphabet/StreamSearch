import Resolver from "../resolver.js";


///////////////////////////////////////////
//  EMBED : ERROR : NO RESULT
///////////////////////////////////////////


export default function (author, title) {
    return {
        ephemeral: true,
        embeds: [
            {
                title       : "No result",
                description : `No movie found for \`${title}\`\n`,
                color       : Resolver.resolveColor("Red")
            }
        ],
        components: author.flag
            ? [
                {
                    type: 1,
                    components:  [
                        {
                            type        : 2,
                            style       : Resolver.resolveButtonStyle("SUCCESS"),
                            label       : "Add a movie",
                            custom_id   : "button_create_new"
                        }
                    ]
                }
            ]
            : null
    };
}
