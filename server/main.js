Meteor.startup(function() {
    var diagrams = Diagram.find().fetch();
    if (diagrams.length === 0) {
        Diagram.insert({
            title: 'New Diagram',
            createdAt: Date.now() / 1000
        })
    }
});