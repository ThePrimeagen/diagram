Meteor.publish('diagram', function() {
    console.log("diagram: ");
    return Diagram.find({});
});

Meteor.publish('assets', function(diagramId) {
    console.log("Assets: " + diagramId);
    return Assets.find({diagramId: diagramId});
});
