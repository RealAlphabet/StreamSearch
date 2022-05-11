import Resolver from "../resolver.js";
import Index from "../index.js";

///////////////////////////////////////////
//  UTILS
///////////////////////////////////////////


const REGEX_LINK = /^https?:\/\/([^\/]+)/;


///////////////////////////////////////////
//  EMBED : POSTER
///////////////////////////////////////////


export default function (author, poster) {
    let url         = REGEX_LINK.test(poster.media) ? poster.media : null;
    let components  = [
        {
            type        : 2,
            style       : Resolver.resolveButtonStyle("LINK"),
            label       : "GitHub",
            url         : Index.link,
            disabled    : false
        }
    ];

    // Check host permissions.
    author.flag && components.push({
        type        : 2,
        style       : Resolver.resolveButtonStyle("SECONDARY"),
        label       : "Edit movie",
        custom_id   : `button_edit_${poster.id}`
    },
    {
        type        : 2,
        style       : Resolver.resolveButtonStyle("DANGER"),
        label       : "Delete movie",
        custom_id   : `button_delete_${poster.id}`
    });

    return {
        ephemeral: true,
        embeds: [
            {
                title       : poster.title,
                description : poster.description,
                color       : Resolver.resolveColor("#303136"),
                image       : { url }
            }
        ],
        components: [
            {
                type: 1,
                components
            }
        ]
    };
}
