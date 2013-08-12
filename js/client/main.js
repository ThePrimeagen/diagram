define([
    'js/client/diagram/svg/SVGGenerator',
    'js/client/diagram/template_interactions',
    'js/client/routes'
], function(
    SVGGenerator,
    TemplateInteractions,
    Routes
) {
    // Initializes some blank variables.
    Session.set('generation', 0);
    Session.set('diagramId', null);
    Session.set('diagram', null);
    Session.set('selectedType', SVGGenerator.Types.CIRCLE);
});