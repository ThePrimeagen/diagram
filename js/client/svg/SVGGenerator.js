define([
], function() {
    var SVGGenerator = {
        /**
         * Creates a circle in the svg area
         * @param svgArea
         * @param configuration
         */
        circle: function(svgArea, configuration) {
            var settings = $.extend({
                cy: 1,
                cx: 1,
                r: 1,
                stroke: 'black',
                'stroke-width': 2,
                fill: 'white'
            }, configuration);
            return this._configure(svgArea.append('circle'), settings);
        },

        /**
         * Configures the model with the settings
         * @param model
         * @param settings
         * @private
         */
        _configure: function(model, settings) {
            for (var key in settings) {
                model.attr(key, settings[key]);
            }
            return model;
        }
    };

    return SVGGenerator;
})