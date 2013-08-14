// Models
Diagram = new Meteor.Collection('Diagram');
Assets = new Meteor.Collection('Assets');

// Allowed transfers
Diagram.allow({
    insert: function(userId, diagram) {
        return true;
    },
    update: function(userId, diagram) {
        return true;
    },
    remove: function(userId, diagram) {
        return true;
    }
});

Assets.allow({
    insert: function(userId, diagram) {
        return true;
    },
    update: function(userId, diagram) {
        return true;
    },
    remove: function(userId, diagram) {
        return true;
    }
});

/**
 * A static namespace for app level information
 * @type {{version: string}}
 */
AppDiagram = {
    version: '0.0.3'
}
