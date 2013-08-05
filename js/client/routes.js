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
    '/sign_in': {
        as: 'sign_in',
        to: 'sign_in'
    },
    '*': function() {
        return 'not_found';
    }
});

Meteor.Router.filters({
    'validateDiagram': function(page) {
        // TODO: Will require a refactor
        return page;
    },
    'checkLogin': function(page) {
        if (Meteor.loggingIn()) {
            return 'loading';
        } else if (Meteor.user()) {
            return page;
        } else {
            return 'sign_in';
        }
    }
});

Meteor.Router.filter('validateDiagram', {only: 'diagram'});
//Meteor.Router.filter('checkLogin', {except: ['help', 'home']});
