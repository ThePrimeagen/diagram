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

    deleteAllAssets: function() {
        var assets = DiagramAssets.find().fetch();
        for (var key in assets) {
            var a = assets[key];
            DiagramAssets.remove(a._id);
        }
    },

    /**
     * Creates asset and returns the ID
     * @param assetType
     * @param assetData
     */
    createAsset: function(assetType, assetData, diagramId) {
        return DiagramAssets.insert({
            diagramId: diagramId,
            type: assetType,
            data: assetData
        });
    },

    /**
     * Should be ran regularly
     */
    clearUserSessions: function() {
        // TODO: Backdoor for clearing user sessions that are over a day old
    }
})
