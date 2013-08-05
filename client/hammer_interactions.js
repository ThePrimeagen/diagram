var diagram;

Template.diagram.rendered = function() {
    // Enforces the diagram editor to attach to the diagram when rendered
    if (!diagram) {
        diagram = new Diagram();
    }
};

var Diagram = (function(context) {

    // NOTE: The naming with $ is a traceur convention
    /**
     * @param configuration
     */
    var $Diagram = function(configuration) {
        var settings = $.extend({
            hitArea: '.hitArea',
            renderArea: '.renderArea'
        }, configuration);
        this._initializeInteraction(settings);
        this._initializeRendering(settings);
    }

    $Diagram.prototype = {
        /**
         * Sets up the interaction events
         * @param settings
         * @private
         */
        _initializeInteraction: function(settings) {
            this._hitArea = $(settings.hitArea)[0];
            this._hammer = new Hammer(this._hitArea, {
                prevent_default: true
            });
            this._hammer.on('tap', this._onClick());
        },

        /**
         * Initializes the rendering platform for svg
         * @param settings
         * @private
         */
        _initializeRendering: function(settings) {
            this._renderArea = d3.select(settings.renderArea);
            this._svgArea = this._renderArea.append('svg')
                .attr('width', '100%')
                .attr('height', '100%');
        },

        _onClick: function() {
            var self = this;
            return function(event) {
                var xy = self._getXYFromHammerEvent(event);
                var circle = SVGGenerator.circle(self._svgArea, {
                    cx: xy.x,
                    cy: xy.y,
                    r: 25
                });

                // Takes the circle and persist the circle
            };
        },

        /**
         * Gets the xy from hammer event
         * @param event
         * @private
         */
        _getXYFromHammerEvent: function(event) {
            var touch = event.gesture.touches[0];
            var offset = $(touch.target).offset();

            return {
                x: touch.pageX - offset.left,
                y: touch.pageY - offset.top
            };
        }
    };
    return $Diagram;
})(this);

/**
 * The SVGGenerator
 */
var SVGGenerator = (function(context) {
    return {
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

})(this);