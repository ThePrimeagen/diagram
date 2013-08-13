define([
    'js/client/diagram/svg/SVGModelMixin',
    'js/client/data/AssetPersistence'
], function(
    SVGModelMixin,
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

    SVGRect.prototype = new SVGModelMixin();

    /**
     * If the circle has been clicked
     */
    SVGRect.prototype.click = function() {
        // selection?
    };

    /**
     * Updates the position of the circle and radius if passed in
     * @param {{x: Number, y: Number}} position
     * @param {Mixed} [options]
     */
    SVGRect.prototype.update = function(position, options) {
        var attributes = $.extend({
            x: position.x - this.attributes.width / 2,
            y: position.y - this.attributes.height / 2
        }, options);

        this._updateAttributes(this.attributes, attributes);
        this._mapAttributes(this.svgModel, attributes);
        AssetPersistence.update(this.id, {model: this.attributes});
    }

    return SVGRect;
});


