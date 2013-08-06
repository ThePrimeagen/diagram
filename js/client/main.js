define([
    'js/client/Diagram',
    'js/client/template_interactions',
    'js/client/routes'
], function(Diagram, TemplateInteractions, HammerInteractions, Routes) {

    var diagram;

    // Ties into the diagram template upon render.
    Template.diagram.rendered = function() {
        // Enforces the diagram editor to attach to the diagram when rendered
        if (!diagram) {
            diagram = new Diagram();
        }

        Meteor.autorun(function(c) {
            var id = Session.get('diagramId');

            if (!id) {
                c.stop();
                return;
            } else {
                diagram.update(Assets.find().fetch());
            }
        });
    };

});