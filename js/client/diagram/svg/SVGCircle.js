define([
    'js/client/diagram/svg/SVGSelectableModel',
    'js/client/data/AssetPersistence'
], function(
    SVGSelectableModel,
    AssetPersistence
) {

    /**
     * Creates a new circle
     * @param {{
     *     svg: Array|D3Element,
     *     attributes: {},
     *     id: String
     * }} configuration
     * @constructor
     */
    var SVGCircle = function(configuration) {
        /**
         * @type {string}
         * @private
         */
        this._type = 'circle';

        /**
         * The available set of attributes
         * @type {{
         *     cx: Number,
         *     cy: Number,
         *     r: Number,
         *     stroke: String,
         *     stroke-width: Number,
         *     fill: String
         * }}
         */
        this.attributes = $.extend({
            cx: 0,
            cy: 0,
            r: 0,
            stroke: 'black',
            'stroke-width': 2,
            fill: 'white'
        }, configuration.attributes);

        /**
         * @type {Mixed}
         */
        this.svgModel = {};

        /**
         * @type {HTMLElement}
         */
        this.svg = configuration.svg;

        // Internal mixin setup
        this._initialize(configuration.id);
    };

    SVGCircle.prototype = new SVGSelectableModel();

    /**
     * If the circle has been clicked
     */
    SVGCircle.prototype.click = function() {

        // Draws the selection box
        this.drawSelectBox();
    };

    /**
     * Updates the position of the circle and radius if passed in
     * @param {{x: Number, y: Number}} position
     * @param {HTMLElement} srcElement
     * @param {Event} event
     */
    SVGCircle.prototype._translate = function(position, srcElement, event) {
        var attributes = {
            cx: position.x,
            cy: position.y
        };

        this._updateAttributes(this.attributes, attributes);
        this._mapAttributes(this.svgModel, attributes);
        AssetPersistence.update(this.id, {model: this.attributes});
    };

    /**
     * Gets the current bounding box for the circle.
     * @private
     */
    SVGCircle.prototype._getBoundingBox = function() {
        var radius = this.attributes.r;
        var r2 = radius * 2;
        return {
            x: this.attributes.cx - radius - 2,
            y: this.attributes.cy - radius - 2,
            width: r2 + 4,
            height: r2 + 4
        };
    };

    return SVGCircle;
});


