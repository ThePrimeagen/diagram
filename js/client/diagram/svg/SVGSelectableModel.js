define([
    'js/client/diagram/svg/SVGModel',
    'js/client/diagram/svg/SVGGenerator'
], function(
    SVGModel,
    SVGGenerator
) {

    var SVGSelectableModel = function() {};
    SVGSelectableModel.prototype = new SVGModel();

    /**
     * Draws the select box around the model.
     */
    SVGSelectableModel.prototype.drawSelectBox = function() {

        if (!this._selected) {
            this._currentBoundingBox = this._getBoundingBox();
            var config = _.clone(this._currentBoundingBox);
            config['fill-opacity'] = 0;
            config.stroke = '#ddd';

            var attributes = SVGGenerator.rect(config);

            // Builds the select model on top of the current model.
            this._selectionRect = this.svg.append('rect');
            this._selectionRect.attr('id', 'rect-' + this.id);
            this._mapAttributes(this._selectionRect, attributes);
            this._selected = true;
        }
    };

    /**
     * Will translate the selection box to where the model is at.
     * @param {{x: Number, y: Number}} position
     */
    SVGSelectableModel.prototype._translateSelection = function(position) {

        if (this._selected) {
            var attributes = {
                x: position.x - this._currentBoundingBox.width / 2,
                y: position.y - this._currentBoundingBox.height / 2
            };
            this._mapAttributes(this._selectionRect, attributes);
        }
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

    return SVGSelectableModel;
});