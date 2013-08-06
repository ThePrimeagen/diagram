define([
], function() {
    var SVGGenerator = {
        Types: {
            CIRCLE: 'circle',
            RECTANGLE: 'rect'
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
                r: 1,
                stroke: 'black',
                'stroke-width': 2,
                fill: 'white'
            }, configuration);
        }
    };

    return SVGGenerator;
})