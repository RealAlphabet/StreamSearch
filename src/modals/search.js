

///////////////////////////////////////////
//  MODAL : CREATE
///////////////////////////////////////////


export default {
    title       : "Find a movie",
    custom_id   : "modal_search",
    components: [
        {
            type: 1,
            components: [
                {
                    type        : 4,
                    custom_id   : "title",
                    label       : "Title :",
                    style       : 1,
                    min_length  : 1,
                    max_length  : 64,
                    placeholder : "Enter movie title",
                    required    : true
                }
            ]
        }
    ]
}
