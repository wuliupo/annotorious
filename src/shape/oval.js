goog.provide('annotorious.shape.geom.Oval');

/**
 * An oval.
 * @param {number} x the anchor point x coordinate
 * @param {number} y the anchor point y coordinate
 * @param {number} width the oval width
 * @param {number} height the oval height
 * @constructor
 */
annotorious.shape.geom.Oval = function (x, y, width, height) {
    if (width > 0) {
        this.x = x;
        this.width = width;
    } else {
        this.x = x + width;
        this.width = -width;
    }

    if (height > 0) {
        this.y = y;
        this.height = height;
    } else {
        this.y = y + height;
        this.height = -height;
    }
}

