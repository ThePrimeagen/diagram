define([

], function() {

    var SVGModelMixin = function() {
    };

    SVGModelMixin.prototype = {
        click: function() {
            throw new Error('NotSupported: #click');
        },
        /**
         * Gets the center point from the model
         * @return {{x:Number, y:Number}}
         */
        getCenterPoint: function() {
            throw new Error('NotSupported: SVGModelMixin#getCenterPoint');
        },
        /**
         * Updates the x and y and possible whatever other options provided.
         * @param {{x: Number, y: Number}} position
         */
        translate: function(position) {
            throw new Error('NotSupported: #update');
        },
        remove: function() {
            throw new Error('NotSupported: #remove');
        },
        /**
         * Gets the type of the svg diagram
         * @returns {String}
         */
        getType: function() {
            return this._type;
        },
        /**
         * Sets a fresh set of attributes to the model.
         * @param attributes
         */
        setAttributes: function(attributes) {
            $.extend(this.attributes, attributes);
            this._mapAttributes(this.svgModel, this.attributes);
        },

        /**
         * Should be called at the beginning of the child constructor
         * @param {String} [id]
         * @private
         */
        _initialize: function(id) {

            this.svgModel = this.svg.append(this.getType());
            this._mapAttributes(this.svgModel, this.attributes);
            this.id = id || '';
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
         * Updates the attributes on the model
         * @param modelAttributes
         * @param attributes
         * @private
         */
        _updateAttributes: function(modelAttributes, attributes) {
            $.extend(modelAttributes, attributes);
        }
    };

    Object.defineProperties(SVGModelMixin.prototype, {
        id: {
            get: function() { return this._id; },
            set: function(id) {
                this._id = id;
                this.svgModel.attr('id', this._id);
            }
        }
    });

    return SVGModelMixin;
});