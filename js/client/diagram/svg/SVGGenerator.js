define([
], function() {
    var SVGGenerator = {
        Types: {
            CIRCLE: 'circle',
            RECTANGLE: 'rect',
            ROUNDED_RECTANGLE: 'rrect'
        },

        /**
         * Creates a circle in the svg area
         * @param svgArea
         * @param configuration
         */
        circle: function(configuration) {
            return $.extend({
                cy: 1,
                cx: 1,
                r: 1
            }, this._coreStyles(), configuration);
        },

        /**
         * Creates the attributes of an svg element
         * @param configuration
         */
        rect: function(configuration) {
            return $.extend({
                x: 1,
                y: 1,
                width: 1,
                height: 1
            }, this._coreStyles(), configuration);
        },

        _coreStyles: function() {
            return {
                stroke: 'black',
                'stroke-width': 2,
                fill: 'white'
            };
        }
    };

    return SVGGenerator;
})