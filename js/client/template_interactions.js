define([
    'js/client/Diagram'
], function(SVGDiagram) {

    var diagram;
    var running = false;

    /**
     * Gets the current snapshot of assets
     * @returns {*}
     */
    function getAssets() {
        return Assets.find().fetch();
    }

    Template.diagram.helpers({
        getDiagramId: function() {
            return Session.get('diagramId');
        },

        generation: function() {
            return Session.get('generat');
        },

        diagram: function() {
            return Diagram.find(Session.get('diagramId')).fetch()[0];
        },

        /**
         * Grabs the assets
         * @returns {*}
         */
        assets: function() {
            return getAssets();
        },

        /**
         * A timestamp for the renderArea
         * @returns {number}
         */
        timestamp: function() {
            return Date.now() / 1000;
        }
    });

    Template.home.rendered = function() {
        console.log('welcome to your home!');
    };


    // Ties into the diagram template upon render.
    Template.diagram.rendered = function() {
        // Enforces the diagram editor to attach to the diagram when rendered

        if (Session.get('forceRefresh')) {
            // Not renedered
            // TODO: ... Why do i hack?  Can i fix this or figure out why it happens
            Session.set('forceRefresh', false);
            $('#applicationArea').html(Meteor.render(Template.diagram));
        }
        if (!diagram) {
            diagram = new SVGDiagram({
                diagramId: Session.get('diagramId')
            });
        } else {
            diagram.refresh(Session.get('diagramId'), getAssets());
        }

        if (!running) {
            Meteor.autorun(function(c) {
                var id = Session.get('diagramId');

                if (!id) {
                    c.stop();
                    running = false;

                    //TODO: 0.0.2 clear svg data
                    return;
                } else {
                    diagram.update(getAssets());
                }
            });
            running = true;
        }
    };


    // Nothing return
    return {};
});
