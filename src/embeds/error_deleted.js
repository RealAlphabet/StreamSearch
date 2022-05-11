import Resolver from "../resolver.js";


///////////////////////////////////////////
//  EMBED : ERROR : DELETED
///////////////////////////////////////////


export default {
    ephemeral: true,
    embeds: [
        {
            title       : "Error",
            description : "This movie is not here anymore.",
            color       : Resolver.resolveColor("Red"),
        }
    ],
    components: []
}
