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