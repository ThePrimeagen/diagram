define([
], function() {


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

    // Nothing return
    return {};
});
