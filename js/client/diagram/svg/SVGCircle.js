define([
    'js/client/diagram/svg/SVGModelMixin',
    'js/client/data/AssetPersistence'
], function(
    SVGModelMixin,
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

    SVGCircle.prototype = new SVGModelMixin();

    /**
     * If the circle has been clicked
     */
    SVGCircle.prototype.click = function() {
        // selection?
    };

    /**
     * Updates the position of the circle and radius if passed in
     * @param {{x: Number, y: Number}} position
     * @param {Mixed} [options]
     */
    SVGCircle.prototype.update = function(position, options) {
        var attributes = $.extend({
            cx: position.x,
            cy: position.y
        }, options);

        this._updateAttributes(this.attributes, attributes);
        this._mapAttributes(this.svgModel, attributes);
        AssetPersistence.update(this.id, {model: this.attributes});
    }

    return SVGCircle;
});


