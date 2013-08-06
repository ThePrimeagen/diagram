define([], function() {

    var AssetPersistence = {
        Types: {
            CIRCLE: 'circle'
        },
        /**
         * Takes in an svg element and type and converts it into a
         * @param type
         * @param model
         * @param diagramId
         */
        create: function(type, model, diagramId) {
            var data = {
                type: type,
                diagramId: diagramId,
                model: model
            };

            return Assets.insert(data);
        },

        /**
         * updates the attributes based on id
         * @param id
         * @param attributes
         */
        update: function(id, attributes) {
            Assets.update(id, {$set: attributes});
        }
    };

    return AssetPersistence;
});