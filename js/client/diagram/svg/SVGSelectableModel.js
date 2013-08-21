define([
    'js/client/diagram/svg/SVGModel',
    'js/client/diagram/svg/SVGGenerator'
], function(
    SVGModel,
    SVGGenerator
) {
    var DEFAULT_SELECT_RECT_COLOR = '#39aecf';
    var DEFAULT_SELECT_HANDLE_RECT_COLOR = '#555';
    var DEFAULT_SELECT_HANDLE_RECT_FILL_COLOR = '#EFEFEF';
    var DEFAULT_SELECT_HANDLE_SIZE = 10;
    var HANDLE_NAMES = ['tl', 'tr', 'tm', 'bl', 'br', 'bm', 'lm', 'rm'];

    /**
     * Will take the bounding box and create selection handles around it
     * @param boundingBox
     * @returns {Array.<Object>}
     */
    function selectHandles(boundingBox) {
        var miniBox = {
            x: 0, y: 0,
            width: DEFAULT_SELECT_HANDLE_SIZE, height: DEFAULT_SELECT_HANDLE_SIZE,
            fill: DEFAULT_SELECT_HANDLE_RECT_FILL_COLOR,
            stroke: DEFAULT_SELECT_HANDLE_RECT_COLOR,
            'stroke-width': 1,
            rx: 3,
            ry: 3
        };
        var x = boundingBox.x - DEFAULT_SELECT_HANDLE_SIZE / 2;
        var y = boundingBox.y - DEFAULT_SELECT_HANDLE_SIZE / 2;
        var w = boundingBox.width;
        var h = boundingBox.height;
        var attrs = SVGGenerator.rect(miniBox);

        // Returns the list of attributes augmented with their position
        return [
            'tl', $.extend(_.clone(attrs), {x: x, y: y}),
            'tr', $.extend(_.clone(attrs), {x: x + w, y: y}),
            'tm', $.extend(_.clone(attrs), {x: x + w / 2, y: y}),
            'bl', $.extend(_.clone(attrs), {x: x, y: y + h}),
            'br', $.extend(_.clone(attrs), {x: x + w, y: y + h}),
            'bm', $.extend(_.clone(attrs), {x: x + w / 2, y: y + h}),
            'lm', $.extend(_.clone(attrs), {x: x, y: y + h / 2}),
            'rm', $.extend(_.clone(attrs), {x: x + w, y: y + h / 2}),
        ];
    }

    var SVGSelectableModel = function() {};
    SVGSelectableModel.prototype = new SVGModel();

    /**
     * Initializes the selectable model.
     * @param {String} id
     * @private
     */
    SVGSelectableModel.prototype._initialize = function(id) {
        this._scale = 1;
        this._handles = {};
        SVGModel.prototype._initialize.apply(this, [id]);
    };

    /**
     * Draws the select box around the model.
     */
    SVGSelectableModel.prototype.drawSelectBox = function() {

        if (!this._selected) {
            this._currentBoundingBox = this._getBoundingBox();
            var config = _.clone(this._currentBoundingBox);
            config['fill-opacity'] = 0;
            config.stroke = DEFAULT_SELECT_RECT_COLOR;

            var attributes = SVGGenerator.rect(config);

            // Builds the select model on top of the current model.
            this._selectionRect = this.svg.append('rect');
            this._selectionRect.attr('id', 'rect-' + this.id);
            this._mapAttributes(this._selectionRect, attributes);
            this._selected = true;

            // Maps over the handles to the selection rectangle.
            var handleAttrs = selectHandles(this._currentBoundingBox);
            this._selectionHandles = [];
            for (var i = 0, len = handleAttrs.length; i < len; i += 2) {
                var id = handleAttrs[i] + '-' + this.id;
                var handle = this.svg.append('rect').attr('id', id);
                this._mapAttributes(handle, handleAttrs[i + 1]);
                this._selectionHandles.push(handle);
                this._handles[id] = handle;
            }
        }
    };

    /**
     * Will translate the selection box to where the model is at.
     * @param {{x: Number, y: Number}} position
     * @param {HTMLElement} srcElement
     * @param {Event} event
     */
    SVGSelectableModel.prototype.translate = function(position, srcElement, event) {

        if (this._selected) {

            // If the drag needs to be a scale.  It only happens when a selection handle has been grabbed
            if (this._onSelectionHandle(srcElement)) {
                this.scale(position, srcElement, event);
                return;
            }

            var selectBoxX = position.x - this._currentBoundingBox.width / 2;
            var selectBoxY = position.y - this._currentBoundingBox.height / 2;
            var xDelta = this._selectionRect.attr('x') - selectBoxX;
            var yDelta = this._selectionRect.attr('y') - selectBoxY;

            var attributes = {
                x: selectBoxX,
                y: selectBoxY
            };
            this._mapAttributes(this._selectionRect, attributes);

            // Moves the handles with it
            for (var i = 0, len = this._selectionHandles.length; i < len; i++) {
                var x = this._selectionHandles[i].attr('x');
                var y = this._selectionHandles[i].attr('y');
                this._mapAttributes(this._selectionHandles[i], {x: x - xDelta, y: y - yDelta});
            }
        }

        // Translate the child object
        this._translate(position, event);
    };

    /**
     * Performs a scale on the selectable model.
     * @param {{x: Number, y: Number}} position
     * @param {HTMLElement} srcElement
     * @param {Event} event
     */
    SVGSelectableModel.prototype.scale = function(position, srcElement, event) {
        // 1: Calculate scale
        // 2: scale inner object
        // 3: Scale selection handles

        // 1
        var handle = this._handles[event.srcElement.id];
        var scale = 1;

        // 2
        this._scale(scale);

        // 3
    };

    /**
     * Must be implemented so that the inner model knows how to translate itself.
     * @param {Any} position
     * @private
     */
    SVGSelectableModel.prototype._translate = function(position) {
        throw new Error('NotImplementedException: SVGSelectableModel#_translate');
    };

    /**
     * Must be implemented so that the inner model knows how to scale itself.
     * @param {Any} position
     * @private
     */
    SVGSelectableModel.prototype._scale = function(scale) {
        throw new Error('NotImplementedException: SVGSelectableModel#_scale');
    };

    /**
     * Unselects the model.  Which means to remove the bounding box from the
     * current model.
     */
    SVGSelectableModel.prototype.unselect = function() {
        this._selected = false;
        this._currentBoundingBox = null;
        this._selectionRect.remove();
        this._selectionRect = null;

        for (var i = 0, len = this._selectionHandles.length; i < len; i++) {
            this._selectionHandles[i].remove();
        }
        this._selectionHandles = null;
    };

    /**
     * An internal required override method for the selection area to get the
     * tightest known bounding box.
     * @returns {{
     *     x: Number,
     *     y: Number,
     *     width: Number,
     *     height: Number
     * }}
     * @private
     */
    SVGSelectableModel.prototype._getBoundingBox = function() {
        throw new Error('Not Implemented Exception: SVGSelectableModelMixin#_getBoundingBox');
    };

    /**
     * if the current model is selected.
     * @returns {Boolean}
     */
    SVGSelectableModel.prototype.isSelected = function() {
        return this._selected;
    };

    /**
     * If the event is on a selection handle
     * @params {HTMLElement} srcElement
     * @returns {Boolean}
     * @private
     */
    SVGSelectableModel.prototype._onSelectionHandle = function(srcElement) {
        var id = srcElement.id;
        return id.indexOf('-') >= 0 && _.contains(HANDLE_NAMES, id.split('-')[0]);
    };
    return SVGSelectableModel;
});