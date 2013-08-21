Deps.autorun(function() {
    Meteor.subscribe('diagram');
    Meteor.subscribe('diagramAssets', Session.get('diagramId'));
});
