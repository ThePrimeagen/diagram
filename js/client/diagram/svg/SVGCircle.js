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
        this._type = 'ellipse';

        /**
         * The available set of attributes
         * @type {{
         *     cx: Number,
         *     cy: Number,
         *     rx: Number,
         *     ry: Number,
         *     stroke: String,
         *     stroke-width: Number,
         *     fill: String
         * }}
         */
        this.attributes = $.extend({
            cx: 0,
            cy: 0,
            rx: 0,
            ry: 0,
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
     * Gets the center point
     * @returns {{x: Number, y: Number}}
     */
    SVGCircle.prototype.getCenterPoint = function() {
        return {
            x: this.svgModel.attr('cx'),
            y: this.svgModel.attr('cy')
        };
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
        var rx = this.attributes.rx;
        var ry = this.attributes.ry;
        var rx2 = rx * 2;
        var ry2 = rx * 2;
        return {
            x: this.attributes.cx - rx - 2,
            y: this.attributes.cy - ry - 2,
            width: rx2 + 4,
            height: rx2 + 4
        };
    };

    /**
     *
     * @param position
     * @param srcElement
     * @param event
     * @private
     */
    SVGCircle.prototype._scale = function(position, srcElement, event) {

    };

    return SVGCircle;
});


