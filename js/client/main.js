define([
    'js/client/Diagram',
    'js/client/template_interactions',
    'js/client/routes'
], function(Diagram, TemplateInteractions, HammerInteractions, Routes) {
    Meteor.startup = function() {
        Session.set('generation', 0);
        Session.set('diagramId', null);
    };
});