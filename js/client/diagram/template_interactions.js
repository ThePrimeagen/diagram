define([
    'js/client/diagram/Diagram',
    'js/client/diagram/svg/SVGGenerator'
], function(
    SVGDiagram,
    SVGGenerator
) {

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
        diagram: function() {
            var diagram = Session.get('diagram');
            if (!diagram) {
                diagram = getDiagram(Session.get('diagramId'));
                Session.set('diagram', diagram);
            }
            return diagram;
        },

        /**
         * Grabs the assets
         * @returns {*}
         */
        assets: function() {
            return getAssets();
        }
    });

    Template.diagramBody.helpers({
        /**
         * A timestamp for the renderArea
         * @returns {number}
         */
        timestamp: function() {
            return Date.now() / 1000;
        }
    });

    Template.diagramShapes.helpers({
        // TODO: 0.1.x Clearly this needs to be refactored for package injection
        /**
         * Available types of the shapes package.
         * @returns {Array}
         */
        types: function() {
            return [
                {
                    displayName: 'Circle',
                    type: SVGGenerator.Types.CIRCLE
                },
                {
                    displayName: 'Rectangle',
                    type: SVGGenerator.Types.RECTANGLE
                },
                {
                    displayName: 'Rounded Rectangle',
                    type: SVGGenerator.Types.ROUNDED_RECTANGLE
                }
            ];
        },

        /**
         * For reactive control
         * @returns {*}
         */
        selectedType: function() {
            return Session.get('selectedType');
        },

        /**
         * If the type is selected.
         * @param type
         * @returns {boolean}
         */
        isSelected: function(type) {
            var t = Session.get('selectedType');
            if (!t && type === SVGDiagram.DEFAULT_TYPE) {
                return true;
            }
            return t === type;
        }
    });

    Template.diagramShapes.events({
        'click #shapes-list li': function(event) {
            $('#shapes-list li.active').removeClass('active');

            Session.set('selectedType', event.currentTarget.id);
        }
    });

    // Ties into the diagram template upon render.
    Template.diagramBody.rendered = function() {
        // Enforces the diagram editor to attach to the diagram when rendered

        if (Session.get('forceRefresh')) {
            // Not renedered
            // TODO: ... Why do i hack?  Can i fix this or figure out why it happens
            Session.set('forceRefresh', false);
            $('#applicationArea').html(Meteor.render(Template.diagram));
            return;
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
                } else {
                    diagram.update(getAssets());
                }
            });
            running = true;
        }
    };

    /**
     * Gets the diagram by id
     * @param id
     * @returns {*}
     */
    function getDiagram(id) {
        return Diagram.find(id).fetch()[0];
    }


    // Nothing return
    return {};
});
