define([
], function() {

    var diagram;
    var running = false;

    Template.diagram.helpers({
        diagram: function() {
            var id = Session.get('diagramId');
            if (!id) {
                Meteor.Router.to('/404');
                return {};
            }

            var diagram = Diagram.findOne(Session.get('diagramId'));

            // We will redirect the user to a not found page
            if (!diagram) {
                Meteor.Router.to('/404');
                return {};
            }

            return diagram;
        },

        /**
         * Grabs the assets
         * @returns {*}
         */
        assets: function() {
            return Assets.find().fetch();
        }
    });


    // Ties into the diagram template upon render.
    Template.diagram.rendered = function() {
        // Enforces the diagram editor to attach to the diagram when rendered
        if (!diagram) {
            diagram = new Diagram();
        }

        if (!running) {
            Meteor.autorun(function(c) {
                var id = Session.get('diagramId');

                if (!id) {
                    c.stop();
                    running = false;
                    return;
                } else {
                    diagram.update(Assets.find().fetch());
                }
            });
            running = true;
        }
    };


    // Nothing return
    return {};
});
