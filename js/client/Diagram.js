define([
    'js/client/svg/SVGGenerator',
    'js/client/data/AssetPersistence'
], function(SVGGenerator, AssetPersistence) {

    var Diagram = function(configuration) {
        var settings = $.extend({
            renderArea: '.renderArea'
        }, configuration);
        this._initialize(settings);
    }

    Diagram.prototype = {
        update: function(assets) {
            for (var k in assets) {
                // TODO: Easy win is search for ids and only update changes
                var asset = assets[k];
                var attributes = asset.model;
                var foundAssetAttributes = this._svgAttributeMap[asset._id];

                if (foundAssetAttributes) {
                    if (!this._isModelSame(foundAssetAttributes, attributes)) {
                        this._updateAsset(attributes, asset._id);
                    }

                } else {
                    this._addAsset(AssetPersistence.Types.CIRCLE, attributes, asset._id);
                }
            }
        },

        /**
         * Sets up the interaction events
         * @param settings
         * @private
         */
        _initialize: function(settings) {
            this._renderArea = d3.select(settings.renderArea);
            this._hammer = new Hammer($(settings.renderArea)[0], {
                prevent_default: true
            });
            this._hammer.on('tap', this._onClick());
            this._hammer.on('dragstart', this._onDragStart());
            this._hammer.on('drag', this._onDrag());
            this._hammer.on('dragend', this._onDragEnd());

            this._svgArea = this._renderArea.append('svg')
                .attr('width', '100%')
                .attr('height', '100%')

            this._svgAttributeMap = {};
            this._svgElementMap = {};
        },

        _onClick: function() {
            var self = this;
            return function(event) {
                var xy = self._getXYFromHammerEvent(event);
                var circleAttributes = SVGGenerator.circle({
                    cx: xy.x,
                    cy: xy.y,
                    r: 25
                });
                var id = AssetPersistence.create(AssetPersistence.Types.CIRCLE, circleAttributes, Session.get('diagramId'));
                self._addAsset(AssetPersistence.Types.CIRCLE, circleAttributes, id);
            };
        },

        /**
         * Adds the asset to the asset graph
         * @param type
         * @param attributes
         * @param id
         * @private
         */
        _addAsset: function(type, attributes, id) {
            var circle = this._mapAttributes(this._svgArea.append('circle'), attributes);
            circle.attr('id', id);
            this._svgAttributeMap[id] = attributes;
            this._svgElementMap[id] = circle;
        },

        /**
         * Updates the asset and sets the attributes
         * @param attributes
         * @param id
         * @private
         */
        _updateAsset: function(attributes, id) {
            this._svgAttributeMap[id] = attributes;
            this._mapAttributes(this._svgElementMap[id], attributes);
        },

        _onDragStart: function() {
            var self = this;
            return function(event) {
                self._dragElement = event.srcElement;
            };
        },

        /**
         * on a drag operation.  If the srcElement is not the current then the
         * item being clicked on the render board (an svg element) will be moved
         * @private
         */
        _onDrag: function() {
            var self = this;
            return function(event) {
                var id = self._dragElement.id;
                var attributes = self._svgAttributeMap[id];
                var element = self._svgElementMap[id];

                if (event.currentTarget instanceof SVGCircleElement) {
                    return;
                }

                if (attributes) {
                    var xy = self._getXYFromHammerEvent(event);

                    attributes.cx = xy.x;
                    attributes.cy = xy.y;

                    self._mapAttributes(element, attributes);
                    AssetPersistence.update(id, {model: attributes});
                }
            };
        },

        /**
         * On a drag end event, the element will finally persistence it self
         * @returns {Function}
         * @private
         */
        _onDragEnd: function() {
            var self = this;
            return function(event) {
                var id = self._dragElement.id;
                var attributes = self._svgAttributeMap[id];

                if (attributes) {
                    AssetPersistence.update(id, {model: attributes});
                }
            };
        },
        /**
         * Gets the xy from hammer event
         * @param event
         * @private
         */
        _getXYFromHammerEvent: function(event) {
            var touch = event.gesture.touches[0];
            var offset = $(event.currentTarget).offset();

            return {
                x: touch.pageX - offset.left,
                y: touch.pageY - offset.top
            };
        },

        /**
         * Maps the attributes to the model
         * @param model
         * @param attributes
         * @private
         */
        _mapAttributes: function(model, attributes) {
            for (var k in attributes) {
                model.attr(k, attributes[k]);
            }
            return model;
        },
        /**
         * Compares two models
         * @param {{}} a
         * @param {{}} b
         * @private
         */
        _isModelSame: function(a, b) {
            for (var k in a) {
                if (b[k] !== a[k]) {
                    return false;
                }
            }
            return true;
        }
    };
    return Diagram;
});
