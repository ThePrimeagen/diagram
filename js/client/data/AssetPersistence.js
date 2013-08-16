define([], function() {

    // TODO: 0.0.3 make this generalize
    var AssetPersistence = function() {
    };
    AssetPersistence.prototype = {
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

            return DiagramAssets.insert(data);
        },

        /**
         * updates the attributes based on id
         * @param id
         * @param attributes
         */
        update: function(id, attributes) {
            DiagramAssets.update(id, {$set: attributes});
        }
    };

    return new AssetPersistence();
});
