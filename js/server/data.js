Meteor.publish('diagram', function() {
    console.log("diagram: ");
    return Diagram.find({});
});

Meteor.publish('diagramAssets', function(diagramId) {
    console.log("DiagramAssets: " + diagramId);
    return DiagramAssets.find({diagramId: diagramId});
});
