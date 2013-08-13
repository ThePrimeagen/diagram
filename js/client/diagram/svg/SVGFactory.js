define([
    'js/client/data/AssetPersistence',
    'js/client/diagram/svg/SVGGenerator',
    'js/client/diagram/svg/SVGCircle',
    'js/client/diagram/svg/SVGRect'
], function(
    AssetPersistence,
    SVGGenerator,
    SVGCircle,
    SVGRect
) {
    var SVGModelFactory = {};

    /**
     * Creates the model.  ID is not required
     * @param type
     * @param svg
     * @param [options]
     * @returns {SVGCircle|SVGRect}
     */
    function createModel(type, svg, options) {
        var settings = $.extend({
            id: ''
        }, options);
        var attributes;

        // TODO: 0.0.4 Refactor generator and factory into one class
        if (type === SVGGenerator.Types.CIRCLE) {

            // TODO: 0.0.4 SVGFactory should not have this much stuff tieing in.  We should
            // be doing this within SVGCircle
            if (settings.attributes) {
                attributes = SVGGenerator.circle(settings.attributes);
            } else {
                attributes = SVGGenerator.circle({
                    cx: settings.position.x,
                    cy: settings.position.y,
                    r: 25
                });
            }

            return new SVGCircle({
                svg: svg,
                attributes: attributes,
                id: settings.id
            });
        } else if (type === SVGGenerator.Types.RECTANGLE || type === SVGGenerator.Types.ROUNDED_RECTANGLE) {
            if (settings.attributes) {
                attributes = SVGGenerator.rect(settings.attributes);
            } else {
                attributes = SVGGenerator.rect({
                    x: settings.position.x - 25,
                    y: settings.position.y - 25,
                    width: 50,
                    height: 50
                });
            }

            return new SVGRect({
                svg: svg,
                attributes: attributes,
                id: settings.id,
                rounded: type === SVGGenerator.Types.ROUNDED_RECTANGLE
            });
        }
    }

    /**
     * Creates a model and saves it to the db.
     * @param type
     * @param svg
     * @param position
     * @param diagramId
     * @returns {SVGRect|SVGCircle}
     */
    SVGModelFactory.create = function(type, svg, position, diagramId) {
        var model = createModel(type, svg, {position: position});
        var id = AssetPersistence.create(type, model.attributes, diagramId);
        model.id = id;
        return model;
    };

    /**
     * Initializes a model without adding it to the db
     * @param type
     * @param svg
     * @param attributes
     * @param id
     * @returns {SVGRect|SVGCircle}
     */
    SVGModelFactory.createFromAttributes = function(type, svg, attributes, id) {
        return createModel(type, svg, {attributes: attributes, id: id});
    }

    return SVGModelFactory;
});


