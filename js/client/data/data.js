Deps.autorun(function() {
    Meteor.subscribe('diagram');
    Meteor.subscribe('assets', Session.get('diagramId'));
});
