Meteor.methods({
    'create_diagram': function() {
        return Diagram.insert({title: 'Undefined Title'});
    },

    // TODO: REMOVE BEFORE LIVE
    'delete_all_diagrams': function() {
        var diagrams = Diagram.find().fetch();
        for (var key in diagrams) {
            var diagram = diagrams[key];
            Diagram.remove(diagram._id);
        }
    }
})
