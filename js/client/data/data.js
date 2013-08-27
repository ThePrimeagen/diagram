Deps.autorun(function() {
    console.log('js/client/data/data');
    // diagram
    Meteor.subscribe('diagram');
    Meteor.subscribe('diagramAssets', Session.get('diagramId'));
//    console.log('Diagrams' + Diagrams.find().fetch().length);
});
