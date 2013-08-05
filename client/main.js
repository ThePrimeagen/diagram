
Template.diagram.helpers({
    diagram: function() {
        var diagram = Diagram.findOne(Session.get('diagramId'));

        // We will redirect the user to a not found page
        if (!diagram) {
            Meteor.Router.to('/404');
        }

        return diagram;
    }
});