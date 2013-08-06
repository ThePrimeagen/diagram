Meteor.Router.add({
    '/diagram/:id': {
        as: 'diagram',
        to: function(id) {
            Session.set('diagramId', id);
            return "diagram";
        }
    },
    '/': {
        as: 'home',
        to: 'help'
    },
    '/help': {
        as: 'help',
        to: 'help'
    },
    '/new_diagram': {
        as: 'new_diagram',
        to: function() {
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
    removeDiagramId: function(page) {
        Session.set('diagramId', null);
    }
});

Meteor.Router.filter('validateDiagram', {only: 'diagram'});
Meteor.Router.filter('removeDiagramId', {except: 'diagram'});
