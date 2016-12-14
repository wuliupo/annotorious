/**
 * Created by Bain on 12/8/2016.
 */
goog.provide('annotorious.plugins.selection.OvalSelector');

goog.require('goog.events');

goog.require('annotorious.events.ui');

/**
 * The oval selector: a click-and-drag oval selection tool
 * @constructor
 */
annotorious.plugins.selection.OvalSelector = function () {
};

/**
 * Initializes the selector
 * @param annotator
 * @param canvas
 */
annotorious.plugins.selection.OvalSelector.prototype.init = function (annotator, canvas) {
    /** @private **/
    this._OUTLINE = '#ffffff';

    /** @private **/
    this._HI_OUTLINE = '#ffffff';

    /** @private **/
    this._STROKE_WIDTH = 2;

    /** @private **/
    this._HI_STROKE_WIDTH = 3;

    /** @private **/
    this._canvas = canvas;

    /** @private **/
    this._annotator = annotator;

    /** @private **/
    this._g2d = canvas.getContext("2d");
    this._g2d.lineWidth = 1;

    /** @private **/
    this._anchor;

    /** @private **/
    this._enabled = false;

    /** @private **/
    this._mouseMoveListener;

    /** @private **/
    this._mouseUpListener;
}

/**
 * Attaches MOUSEUP and MOUSEMOVE listeners to the editing canvas.
 * @private
 */
annotorious.plugins.selection.OvalSelector.prototype._attachListener = function () {
    var self = this;
    var canvas = this._canvas;

    this._mouseMoveListener = goog.events.listen(canvas, annotorious.events.ui.EventType.MOVE, function (event) {
        var points = annotorious.events.ui.sanitizeCoordinates(event, canvas);
        if (self._enabled) {
            self._opposite = {x: points.x, y: points.y};

            self._g2d.clearRect(0, 0, canvas.width, canvas.height);

            var width = self._opposite.x - self._anchor.x;
            var height = self._opposite.y - self._anchor.y;

            self.drawShape(self._g2d, {
                type: annotorious.shape.ShapeType.OVAL,
                geometry: {
                    x: width > 0 ? self._anchor.x : self._opposite.x,
                    y: height > 0 ? self._anchor.y : self._opposite.y,
                    width: Math.abs(width),
                    height: Math.abs(height)
                },
                style: {}
            });
        }
    });

    this._mouseUpListener = goog.events.listen(canvas, annotorious.events.ui.EventType.UP, function (event) {
        var points = annotorious.events.ui.sanitizeCoordinates(event, canvas);
        var shape = self.getShape();
        event = (event.event_) ? event.event_ : event;
        self._enabled = false;

        if (shape) {
            self._detachListeners();
            self._annotator.fireEvent(annotorious.events.EventType.SELECTION_COMPLETED,
                {mouseEvent: event, shape: shape, viewportBounds: self.getViewportBounds()});
        } else {
            self._annotator.fireEvent(annotorious.events.EventType.SELECTION_CANCELED);
            var annotations = self._annotator.getAnnotationsAt(points.x, points.y);
            if (annotations.length > 0) {
                self._annotator.highlightAnnotation(annotations[0]);
            }
        }
    });
}

/**
 * Detaches MOUSEUP and MOUSEMOVE listeners from the editing canvas.
 * @private
 */
annotorious.plugins.selection.OvalSelector.prototype._detachListeners = function () {
    if (this._mouseMoveListener) {
        goog.events.unlistenByKey(this._mouseMoveListener);
        delete this._mouseMoveListener;
    }
    if (this._mouseUpListener) {
        goog.events.unlistenByKey(this._mouseUpListener);
        delete this._mouseUpListener;
    }
}

/**
 * Selector API method: returns the selector name
 * @returns {string}
 */
annotorious.plugins.selection.OvalSelector.prototype.getName = function () {
    return "oval";
}

/**
 * Selector API method: returns the supported shape type
 * @returns {annotorious.shape.ShapeType|string}
 */
annotorious.plugins.selection.OvalSelector.prototype.getSupportedShapeType = function () {
    return annotorious.shape.ShapeType.OVAL;
}

/**
 * Sets the properties on this selector
 * @param props
 */
annotorious.plugins.selection.OvalSelector.prototype.setProperties = function (props) {
    if (props.hasOwnProperty('outline'))
        this._OUTLINE = props['outline'];

    if (props.hasOwnProperty('stroke'))
        this._STROKE = props['stroke'];

    if (props.hasOwnProperty('stroke_width'))
        this._STROKE_WIDTH = props['stroke_width'];
}

/**
 * Selector API method: starts the selection at the specified coordinates
 * @param x
 * @param y
 */
annotorious.plugins.selection.OvalSelector.prototype.startSelection = function (x, y) {
    this._enabled = true;
    this._attachListener();
    this._anchor = new annotorious.shape.geom.Point(x, y);

    goog.style.setStyle(document.body, '-webkit-user-select', 'none');
}

/**
 * Selector API method: stops the selection.
 */
annotorious.plugins.selection.OvalSelector.prototype.stopSelection = function () {
    this._detachListeners();
    this._g2d.clearRect(0, 0, this._canvas.width, this._canvas.height);
    goog.style.setStyle(document.body, '-webkit-user-select', 'auto');
    delete this._opposite;
}

/**
 * Selector API method: returns the currently edited shape.
 * @returns {annotorious.shape.Shape|undefined) } the shape
 */
annotorious.plugins.selection.OvalSelector.prototype.getShape = function () {
    if (this._opposite &&
        (Math.abs(this._opposite.x - this._anchor.x) > 3) &&
        (Math.abs(this._opposite.y - this._anchor.y) > 3)) {

        var viewportBounds = this.getViewportBounds();
        var oval = this._annotator.toItemCoordinates({
            x: viewportBounds.left,
            y: viewportBounds.top,
            width: viewportBounds.right - viewportBounds.left,
            height: viewportBounds.bottom - viewportBounds.top
        });

        return new annotorious.shape.Shape(annotorious.shape.ShapeType.OVAL, oval);
    } else {
        return undefined;
    }
}

/**
 * Selector API method: returns the bounds of the selected shape, in viewport (= pixel) coordinates.
 * @returns {Object} the shape viewport bounds
 */
annotorious.plugins.selection.OvalSelector.prototype.getViewportBounds = function () {
    var right, left;
    if (this._opposite.x > this._anchor.x) {
        right = this._opposite.x;
        left = this._anchor.x;
    } else {
        right = this._anchor.x;
        left = this._opposite.x;
    }

    var top, bottom;
    if (this._opposite.y > this._anchor.y) {
        top = this._anchor.y;
        bottom = this._opposite.y;
    } else {
        top = this._opposite.y;
        bottom = this._anchor.y;
    }

    return {top: top, right: right, bottom: bottom, left: left};
}

/**
 * @param {Object} g2d graphics context
 * @param {annotorious.shape.Shape} shape the shape to draw
 * @param {boolean=} highlight if true, shape will be drawn highlighted
 */
annotorious.plugins.selection.OvalSelector.prototype.drawShape = function (g2d, shape, highlight) {
    var geom, stroke_width, outline;

    if (!shape.style) {
        shape.style = {};
    }

    if (highlight) {
        outline = shape.style.outline || this._OUTLINE;
        stroke_width = this._HI_STROKE_WIDTH;
    } else {
        outline = shape.style.outline || this._OUTLINE;
        stroke_width = this._STROKE_WIDTH;
    }

    geom = shape.geometry;

    var x = geom.x;
    var y = geom.y;
    var width = geom.width;
    var height = geom.height;

    // console.log("x:" + geom.x + " y:" + geom.y + " width:" + geom.width + " height:" + geom.height);

    var kappa = 0.5,
        ox = (width / 2) * kappa, // control point offset horizontal
        oy = (height / 2) * kappa, // control point offset vertical
        xe = x + width,           // x-end
        ye = y + height,           // y-end
        xm = x + width / 2,       // x-middle
        ym = y + height / 2;       // y-middle

    g2d.beginPath();
    g2d.strokeStyle = outline;
    g2d.lineWidth = stroke_width;
    g2d.moveTo(x, ym);
    g2d.bezierCurveTo(x, ym - oy, xm - ox, y, xm, y);
    g2d.bezierCurveTo(xm + ox, y, xe, ym - oy, xe, ym);
    g2d.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye);
    g2d.bezierCurveTo(xm - ox, ye, x, ym + oy, x, ym);
    g2d.stroke();

}


