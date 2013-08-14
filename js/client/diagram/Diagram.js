define([
    'js/client/diagram/svg/SVGGenerator',
    'js/client/diagram/svg/SVGFactory'
], function(
    SVGGenerator,
    SVGFactory
) {

    /**
     * The available set of model tags
     * @type {Array}
     */
    var MODEL_TAGS = ['circle', 'rect'];
    var DEFAULT_SELECTED_TYPE = SVGGenerator.Types.CIRCLE;

    var Diagram = function(configuration) {
        this.settings = $.extend({
            renderArea: '.renderArea'
        }, configuration);

        this._onClickHandler = this._onClick();
        this._onDragStartHandler = this._onDragStart();
        this._onDragHandler = this._onDrag();
        this.diagramId = this.settings.diagramId;

        /**
         * @type {{}}
         * @private
         */
        this._svgModelMap = {};

        this._initialize();
    }

    /**
     * The default type for selected shapes.
     * @type {*}
     */
    Diagram.DEFAULT_TYPE = DEFAULT_SELECTED_TYPE;

    Diagram.prototype = {
        update: function(assets) {
            for (var k in assets) {
                var asset = assets[k];
                var attributes = asset.model;
                var svgModel = this._svgModelMap[asset._id];

                // TODO: RxJS, filter instead on live data streams, not just simple updating
                if (svgModel) {
                    if (!this._isModelSame(svgModel.attributes, attributes)) {
                        svgModel.setAttributes(attributes);
                    }

                } else {

                    var model = SVGFactory.createFromAttributes(asset.type, this._svgArea, attributes, asset._id);
                    this._svgModelMap[asset._id] = model;
                }
            }
        },

        /**
         * Will dispose of the previous svg element and create a new one with new hammer events listening.
         */
        refresh: function(diagramId, latestAssets) {

            var badIds = this._hammer.element.id !== $(this.settings.renderArea).attr('id');
            var newDiagram = diagramId !== this.diagramId;

            // If the ids are bad (new render area cause of template refresh priorities) or
            // diagram id changes.
            if (newDiagram || badIds) {

                if (newDiagram) {
                    // Must be set so we do not wipe out the assets
                    this.diagramId = diagramId;
                    this._readyCache();
                }

                this._destroyHammer();
                this._initializeRenderArea();
                this._initializeHammer();
                this._readyCache();
                this.update(latestAssets);
            }
        },

        /**
         * Sets up the interaction events
         * @private
         */
        _initialize: function() {
            this._initializeRenderArea();
            this._initializeHammer();
            this._readyCache();
        },

        /**
         * Binds hammer to the event listener
         * @private
         */
        _initializeHammer: function() {
            console.log('creating');
            this._hammer = new Hammer($(this.settings.renderArea)[0], {
                prevent_default: true
            });

            this._hammer.on('tap', this._onClickHandler);
            this._hammer.on('dragstart', this._onDragStartHandler);
            this._hammer.on('drag', this._onDragHandler);
        },

        /**
         * uninds hammer from the event listeners
         * @private
         */
        _destroyHammer: function() {
            console.log('destroying');
            this._hammer.off('tap', this._onClickHandler);
            this._hammer.off('dragstart', this._onDragStartHandler);
            this._hammer.off('drag', this._onDragHandler);
            delete this._hammer;
        },

        /**
         * Initializes the render area and its datastructures.
         * @private
         */
        _initializeRenderArea: function() {
            console.log('initializing');
            this._renderArea = $(this.settings.renderArea).html('');
            this._renderArea = d3.select(this.settings.renderArea);
            this._svgArea = this._renderArea.append('svg')
                .attr('width', '100%')
                .attr('height', '100%');
        },

        /**
         * Clears the cache of the diagram (only on new diagram ids)
         * @private
         */
        _readyCache: function() {
            this._svgModelMap = {};
        },

        /**
         * On a click event create the selected object
         * @returns {Function}
         * @private
         */
        _onClick: function() {
            var self = this;

            // TODO: I wonder how this could be refactor
            return function(event) {
                var model;
                if (self._isModelClick(event)) {
                    if (self._selectedModel) {
                        self._unselectModel();
                    }
                    self._selectedModel = self._getSelectedModel(event.srcElement);
                    if (self._selectedModel) {
                        self._selectedModel.click();
                    }
                } else {

                    if (self._selectedModel) {
                        self._unselectModel();
                    } else {
                        // create a new model
                        var xy = self._getXYFromHammerEvent(event);
                        model = SVGFactory.create(
                            Session.get('selectedType'),
                            self._svgArea,
                            xy,
                            Session.get('diagramId')
                        );
                        self._svgModelMap[model.id] = model;
                    }
                }
            }; // return
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
                if (self._dragElement) {
                    var svgModel = self._getSelectedModel(self._dragElement);
                    if (svgModel) {
                        var xy = self._getXYFromHammerEvent(event);
                        svgModel.translate(xy);
                    }
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
         * Compares two models
         * @param {{}} a
         * @param {{}} b
         * @private
         */
        _isModelSame: function(a, b) {
            // TODO: Return a change set so that its more efficient!
            for (var k in a) {
                if (b[k] !== a[k]) {
                    return false;
                }
            }
            return true;
        },

        /**
         * if the hammer event is on a model
         * @param hammerEvent
         * @private
         */
        _isModelClick: function(hammerEvent) {
            return _.contains(MODEL_TAGS, hammerEvent.srcElement.tagName);
        },

        /**
         * Unselects the model
         * @private
         */
        _unselectModel: function() {
            this._selectedModel.unselect();
            this._selectedModel = false;
        },

        /**
         * Takes the event and gets the selected model.
         * @param {HTMLElement} sourceElement
         * @private
         */
        _getSelectedModel: function(sourceElement) {

            var id = sourceElement.id;
            if (id.indexOf('rect-') >= 0 &&
                this._svgModelMap[sourceElement.id.substring(5)]) {
                id = sourceElement.id.substring(5);
            }

            return this._svgModelMap[id];
        }
    };
    return Diagram;
});