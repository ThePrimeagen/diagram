Meteor.Router.add({
    '/diagram/:id': {
        as: 'diagram',
        to: function(id) {
            if (Session.get('diagramId') === id) {
                Session.set('forceRefresh', true);
            }
            Session.set('diagramId', id);
            return "diagram";
        }
    },
    '/': {
        as: 'home',
        to: 'home'
    },
    '/help': {
        as: 'help',
        to: 'home'
    },
    '/new_diagram': {
        as: 'new_diagram',
        to: function() {
            // Invalidate Session
            Session.set('diagramId', null);
            Meteor.call('createDiagram', function(err, id) {
                Meteor.Router.to('/diagram/' + id);
            });
            return 'new_diagram';
        }
    },
    '*': function() {
        return 'not_found';
    }
});

Meteor.Router.filters({
    validateDiagram: function(page) {
        // TODO: Will require a refactor
        return page;
    },
    /**
     * Removes ids on new diagram
     * @param page
     * @returns {*}
     */
    removeDiagramId: function(page) {
        if (page === 'home') {
            Session.set('diagramId', null);
        }
        return page;
    },

    /**
     * Increments the generation to help the flow of the site
     * @param page
     */
    generation: function(page) {
        Session.set('generation', Session.get('generation') + 1);
    }
});

Meteor.Router.filter('validateDiagram', {only: 'diagram'});
Meteor.Router.filter('removeDiagramId');
