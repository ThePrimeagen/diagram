Meteor.methods({
    createDiagram: function() {
        return Diagram.insert({title: 'Undefined Title'});
    },

    // TODO: REMOVE BEFORE LIVE
    deleteAllDiagrams: function() {
        var diagrams = Diagram.find().fetch();
        for (var key in diagrams) {
            var diagram = diagrams[key];
            Diagram.remove(diagram._id);
        }
    },

    /**
     * Creates asset and returns the ID
     * @param assetType
     * @param assetData
     */
    createAsset: function(assetType, assetData, diagramId) {
        return Assets.insert({
            diagramId: diagramId,
            type: assetType,
            data: assetData
        });
    }
})
