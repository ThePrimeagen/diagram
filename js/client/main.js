define([
    'js/client/diagram/template_interactions',
    'js/client/routes'
], function(Diagram, TemplateInteractions, HammerInteractions, Routes) {
    Meteor.startup = function() {
        Session.set('generation', 0);
        Session.set('diagramId', null);
        Session.set('diagram', null);
    };
});