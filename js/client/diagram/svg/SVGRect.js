define([
    'js/client/diagram/svg/SVGSelectableModel',
    'js/client/data/AssetPersistence'
], function(
    SVGSelectableModel,
    AssetPersistence
) {

    /**
     * Creates a new square.  The rounded attribute is set to false default
     * @param {{
     *     svg: Array|D3Element,
     *     attributes: {},
     *     id: String,
     *     rounded: Boolean
     * }} configuration
     * @constructor
     */
    var SVGRect = function(configuration) {
        /**
         * @type {string}
         * @private
         */
        this._type = 'rect';

        /**
         * @type {boolean}
         * @private
         */
        this._rounded = configuration.rounded || false;

        /**
         * The available set of attributes
         */
        this.attributes = $.extend({
            x: 0,
            y: 0,
            width: 0,
            height: 0,
            stroke: 'black',
            'stroke-width': 2,
            fill: 'white',
            rx: this._rounded ? 7 : 0,
            ry: this._rounded ? 7 : 0
        }, configuration.attributes);

        /**
         * @type {Mixed}
         */
        this.svgModel = {};

        /**
         * @type {HTMLElement}
         */
        this.svg = configuration.svg;
        this._initialize(configuration.id);
    };

    SVGRect.prototype = new SVGSelectableModel();

    /**
     * If the circle has been clicked
     */
    SVGRect.prototype.click = function() {
        this.drawSelectBox();
    };

    /**
     * Updates the position of the circle and radius if passed in
     * @param {{x: Number, y: Number}} position
     */
    SVGRect.prototype._translate = function(position) {
        var attributes = {
            x: position.x - this.attributes.width / 2,
            y: position.y - this.attributes.height / 2
        };

        this._updateAttributes(this.attributes, attributes);
        this._mapAttributes(this.svgModel, attributes);
        AssetPersistence.update(this.id, {model: this.attributes});
    };

    /**
     * Gets the current bounding box for the rect.
     * @private
     */
    SVGRect.prototype._getBoundingBox = function() {
        return {
            x: this.attributes.x - 2,
            y: this.attributes.y - 2,
            width: this.attributes.width + 4,
            height: this.attributes.height + 4
        };
    };

    return SVGRect;
});


