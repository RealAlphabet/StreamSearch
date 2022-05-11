import Resolver from "../resolver.js";


///////////////////////////////////////////
//  EMBED : MISSING PERMISSION
///////////////////////////////////////////


export default {
    ephemeral: true,
    embeds: [
        {
            title       : "🔮  Uh-Oh",
            description : "You don't have the permission to do this. ",
            color       : Resolver.resolveColor("Red"),
        }
    ],
    components: []
}
