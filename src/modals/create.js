
///////////////////////////////////////////
//  MODAL : CREATE
///////////////////////////////////////////


export default {
    title       : "Ajouter une affiche",
    custom_id   : "modal_create",
    components: [
        {
            type: 1,
            components: [
                {
                    type        : 4,
                    custom_id   : "title",
                    label       : "Title",
                    style       : 1,
                    min_length  : 1,
                    max_length  : 64,
                    placeholder : "Movie title",
                    required    : true
                }
            ]
        },
        {
            type: 1,
            components: [
                {
                    type        : 4,
                    custom_id   : "description",
                    label       : "Description",
                    style       : 2,
                    min_length  : 1,
                    max_length  : 3000,
                    placeholder : "Short summary and movie link with []().",
                    required    : true
                }
            ]
        },
        {
            type: 1,
            components: [
                {
                    type        : 4,
                    custom_id   : "banner",
                    label       : "Banner",
                    style       : 1,
                    min_length  : 1,
                    max_length  : 255,
                    placeholder : "Link to an HD image.",
                    required    : true
                }
            ]
        },
        {
            type: 1,
            components: [
                {
                    type        : 4,
                    custom_id   : "category",
                    label       : "Category",
                    style       : 1,
                    min_length  : 1,
                    max_length  : 255,
                    placeholder : "Movie category",
                    required    : true
                }
            ]
        }
    ]
}
