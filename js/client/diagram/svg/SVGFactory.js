define([
    'js/client/data/AssetPersistence',
    'js/client/diagram/svg/SVGGenerator',
    'js/client/diagram/svg/SVGCircle'
], function(
    AssetPersistence,
    SVGGenerator,
    SVGCircle
) {
    var SVGModelFactory = {};

    /**
     * Creates the model.  ID is not required
     * @param type
     * @param svg
     * @param [options]
     * @returns {js.client.diagram.svg.SVGCircle}
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
        } else if (type === SVGGenerator.Types.RECTANGLE) {
            attributes = SVGGenerator.rect({
                x: position.x - 25,
                y: position.y - 25,
                width: 50,
                height: 50
            });
        } else if (type === SVGGenerator.Types.ROUNDED_RECTANGLE) {
            attributes = SVGGenerator.rect({
                x: position.x - 25,
                y: position.y - 25,
                width: 50,
                height: 50,
                rx: 7,
                ry: 7
            });
        }
    }

    /**
     * Creates a model and saves it to the db.
     * @param type
     * @param svg
     * @param position
     * @param diagramId
     * @returns {js.client.diagram.svg.SVGCircle}
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
     * @returns {js.client.diagram.svg.SVGCircle}
     */
    SVGModelFactory.createFromAttributes = function(type, svg, attributes, id) {
        return createModel(type, svg, {attributes: attributes, id: id});
    }

    return SVGModelFactory;
});


