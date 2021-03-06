const nanoid = require('nanoid/index.browser.js');

goog.provide('annotorious.shape');

goog.require('annotorious.shape.geom.Point');
goog.require('annotorious.shape.geom.Polygon');
goog.require('annotorious.shape.geom.Rectangle');
goog.require('annotorious.shape.geom.Oval');

/**
 * A shape. Consists of descriptive shape metadata, plus the actual shape geometry.
 * @param {annotorious.shape.ShapeType} type the shape type
 * @param {annotorious.shape.geom.Point | annotorious.shape.geom.Rectangle | annotorious.shape.geom.Polygon} geometry the geometry
 * @param {annotorious.shape.Units=} units geometry measurement units
 * @param {Object} drawing style of the shape (optional)
 * @constructor
 */
annotorious.shape.Shape = function (type, geometry, units, style) {
    this.type = type
    this.geometry = geometry;
    if (units)
        this.units = units;
    if (style)
        this.style = style;
    else
        this.style = {};
}

/**
 * Set shape style by symptom's type(ename)
 * @param ename
 */
annotorious.shape.Shape.prototype.setStyleByType = function (type) {
    if (!Symptoms) return;
    for (var i = 0; i < Symptoms.length; i++) {
        var symptom = Symptoms[i];
        if (symptom['ename'] === type) {
            this.style = {
                outline: symptom['bcolor']
            };
            break;
        }
    }
};

/**
 * Possible shape types
 * @enum {string}
 */
annotorious.shape.ShapeType = {
    POINT: 'point',
    RECTANGLE: 'rect',
    POLYGON: 'polygon',
    OVAL: 'oval'
}

/**
 * Possible unit types
 * @enum {string}
 */
annotorious.shape.Units = {
    PIXEL: 'pixel',
    FRACTION: 'fraction'
}


/** Helper functions & geometry computation utilities **/


/**
 * Checks whether a given shape intersects a point.
 * @param {annotorious.shape.Shape} shape the shape
 * @param {number} px the X coordinate
 * @param {number} py the Y coordinate
 * @return {boolean} true if the point intersects the shape
 */
annotorious.shape.intersects = function(shape, px, py) {
  var geom = shape["geometry"];
    if (shape.type == annotorious.shape.ShapeType.RECTANGLE) {
      if (px < geom.x)
        return false;

      if (py < geom.y)
        return false;

      if (px > geom.x + geom.width)
        return false;

      if (py > geom.y + geom.height)
        return false;

      return true;
    } else if (shape.type == annotorious.shape.ShapeType.POLYGON) {
      var points = geom["points"];
      var inside = false;

      var j = points.length - 1;
      for (var i=0; i<points.length; i++) {
        if ((points[i].y > py) != (points[j].y > py) &&
            (px < (points[j].x - points[i].x) * (py - points[i].y) / (points[j].y-points[i].y) + points[i].x)) {
          inside = !inside;
        }
        j = i;
      }

    var j = points.length - 1;
    for (var i=0; i<points.length; i++) {
      if ((points[i].y > py) != (points[j].y > py) &&
          (px < (points[j].x - points[i].x) * (py - points[i].y) / (points[j].y-points[i].y) + points[i].x)) {
        inside = !inside;
      }
      j = i;
    }

    return inside;
  }

annotorious.shape.intersects = function (shape, px, py) {
    if (shape.type == annotorious.shape.ShapeType.RECTANGLE) {
        if (px < shape.geometry.x)
            return false;

        if (py < shape.geometry.y)
            return false;

        if (px > shape.geometry.x + shape.geometry.width)
            return false;

        if (py > shape.geometry.y + shape.geometry.height)
            return false;

        return true;
    } else if (shape.type == annotorious.shape.ShapeType.POLYGON) {
        var points = shape.geometry.points;
        var inside = false;
        for (var i = 0, j = points.length - 1; i < points.length; j = i++) {
            if ((points[i].y > py) != (points[j].y > py) &&
                (px < (points[j].x - points[i].x) * (py - points[i].y) / (points[j].y - points[i].y) + points[i].x)) {
                inside = !inside;
            }
        }
        return inside;
    } else if (shape.type == annotorious.shape.ShapeType.OVAL) {
        var centerX = shape.geometry.x + shape.geometry.width / 2;
        var centerY = shape.geometry.y + shape.geometry.height / 2;
        var radiusX = shape.geometry.width / 2;
        var radiusY = shape.geometry.height / 2;
        return Math.pow((px - centerX) / radiusX, 2) + Math.pow((py - centerY) / radiusY, 2) <= 1;
    }
}

/**
 * Returns the size of a shape.
 * @param {annotorious.shape.Shape} shape the shape
 * @return {number} the size
 */
annotorious.shape.getSize = function(shape) {
  if (shape.type == annotorious.shape.ShapeType.RECTANGLE) {
    return shape["geometry"].width * shape["geometry"].height;
  } else if (shape.type == annotorious.shape.ShapeType.POLYGON) {
    // return Math.abs(annotorious.shape.geom.Polygon.computeArea(shape.geometry.points));
    var points = shape["geometry"].points;
    var area = 0.0;

    var j = points.length - 1;
    for (var i=0; i<points.length; i++) {
      area += (points[j].x + points[i].x) * (points[j].y -points[i].y);
      j = i;
    }

    return Math.abs(area / 2);
  }
annotorious.shape.getSize = function (shape) {
    if (shape.type == annotorious.shape.ShapeType.RECTANGLE) {
        return shape.geometry.width * shape.geometry.height;
    } else if (shape.type == annotorious.shape.ShapeType.POLYGON) {
        return Math.abs(annotorious.shape.geom.Polygon.computeArea(shape.geometry.points));
    } else if (shape.type == annotorious.shape.ShapeType.OVAL) {
        return Math.PI * shape.geometry.width * shape.geometry.height / 4;
    }
    return 0;
}

/**
 * Returns the bounding rectangle of a shape.
 * @param {annotorious.shape.Shape} shape the shape
 * @return {annotorious.shape.Shape | undefined} the bounding rectangle
 */
annotorious.shape.getBoundingRect = function(shape) {
  if (shape.type == annotorious.shape.ShapeType.RECTANGLE) {
    return shape["geometry"];
  } else if (shape.type == annotorious.shape.ShapeType.POLYGON) {
    var points = shape.geometry.points;

    var left = points[0].x;
    var right = points[0].x;
    var top = points[0].y;
    var bottom = points[0].y;

    for (var i=1; i<points.length; i++) {
      if (points[i].x > right)
        right = points[i].x;

      if (points[i].x < left)
        left = points[i].x;

      if (points[i].y > bottom)
        bottom = points[i].y;

      if (points[i].y < top)
        top = points[i].y;
    }

    return new annotorious.shape.Shape(annotorious.shape.ShapeType.RECTANGLE,
      new annotorious.shape.geom.Rectangle(left, top, right - left, bottom - top),
      false, shape.style
    );
  }

annotorious.shape.getBoundingRect = function (shape) {
    if (shape.type == annotorious.shape.ShapeType.RECTANGLE) {
        return shape;
    } else if (shape.type == annotorious.shape.ShapeType.POLYGON) {
        var points = shape.geometry.points;

        var left = points[0].x;
        var right = points[0].x;
        var top = points[0].y;
        var bottom = points[0].y;

        for (var i = 1; i < points.length; i++) {
            if (points[i].x > right)
                right = points[i].x;

            if (points[i].x < left)
                left = points[i].x;

            if (points[i].y > bottom)
                bottom = points[i].y;

            if (points[i].y < top)
                top = points[i].y;
        }

        return new annotorious.shape.Shape(annotorious.shape.ShapeType.RECTANGLE,
            new annotorious.shape.geom.Rectangle(left, top, right - left, bottom - top),
            false, shape.style
        );
    } else if (shape.type == annotorious.shape.ShapeType.OVAL) {
        return shape;
    }

    return undefined;
}

/**
 * Computes the centroid coordinate for the specified shape.
 * @param {annotorious.shape.Shape} shape the shape
 * @returns {annotorious.shape.geom.Point | undefined} the centroid X/Y coordinate
 */
annotorious.shape.getCentroid = function(shape) {
  if (shape.type == annotorious.shape.ShapeType.RECTANGLE) {
    var rect = shape.geometry;
    return new annotorious.shape.geom.Point(rect.x + rect.width / 2, rect.y + rect.height / 2);
  } else if (shape.type == annotorious.shape.ShapeType.POLYGON) {
    return annotorious.shape.geom.Polygon.computeCentroid( shape.geometry.points);
  }

annotorious.shape.getCentroid = function (shape) {
    if (shape.type == annotorious.shape.ShapeType.RECTANGLE) {
        var rect = shape.geometry;
        return new annotorious.shape.geom.Point(rect.x + rect.width / 2, rect.y + rect.height / 2);
    } else if (shape.type == annotorious.shape.ShapeType.POLYGON) {
        return annotorious.shape.geom.Polygon.computeCentroid(shape.geometry.points);
    } else if (shape.type == annotorious.shape.ShapeType.OVAL) {
        var oval = shape.geometry;
        return new annotorious.shape.geom.Point(oval.x + oval.width / 2, oval.y + oval.height / 2);
    }

    return undefined;
}

/**
 * Expands a shape by a specified delta.
 * @param {annotorious.shape.Shape} shape the shape
 * @param {number} delta the delta
 */
annotorious.shape.expand = function (shape, delta) {
    // TODO for the sake of completeness: implement for RECTANGLE
    return new annotorious.shape.Shape(annotorious.shape.ShapeType.POLYGON,
        new annotorious.shape.geom.Polygon(annotorious.shape.geom.Polygon.expandPolygon(shape.geometry.points, delta)),
        false, shape.style);
}

/**
 * Transforms a shape from a source coordinate system to a destination coordinate
 * system. The transformation is calculated using the transformationFn parameter,
 * which must be a function(xy) that transforms a single XY coordinate.
 * @param {annotorious.shape.Shape} shape the shape to transform
 * @param {Function} transformationFn the transformation function
 * @return {annotorious.shape.Shape | undefined} the transformed shape
 */
annotorious.shape.transform = function(shape, transformationFn) {
  if (shape.type == annotorious.shape.ShapeType.RECTANGLE) {
    var geom = shape.geometry;
    var transformed = transformationFn(geom);
    // return new annotorious.shape.Shape(annotorious.shape.ShapeType.RECTANGLE, transformed, false, shape.style);
    var geom = shape["geometry"];
    var anchor = transformationFn({ x: geom.x, y: geom.y });
    var size = transformationFn({ x: geom.width, y: geom.height });
    return new annotorious.shape.Shape(annotorious.shape.ShapeType.RECTANGLE,
      new annotorious.shape.geom.Rectangle(anchor.x, anchor.y, size.x, size.y));
  } else if (shape.type == annotorious.shape.ShapeType.POLYGON) {
    var transformedPoints = [];
    goog.array.forEach(shape.geometry.points, function(pt) {
      transformedPoints.push(transformationFn(pt));
    });
    return new annotorious.shape.Shape(annotorious.shape.ShapeType.POLYGON,
      new annotorious.shape.geom.Polygon(transformedPoints),
      false, shape.style
    );
  }
annotorious.shape.transform = function (shape, transformationFn) {
    if (shape.type == annotorious.shape.ShapeType.RECTANGLE) {
        var geom = shape.geometry;
        var transformed = transformationFn(geom);
        return new annotorious.shape.Shape(annotorious.shape.ShapeType.RECTANGLE, transformed, false, shape.style);
    } else if (shape.type == annotorious.shape.ShapeType.POLYGON) {
        var transformedPoints = [];
        goog.array.forEach(shape.geometry.points, function (pt) {
            transformedPoints.push(transformationFn(pt));
        });
        return new annotorious.shape.Shape(annotorious.shape.ShapeType.POLYGON,
            new annotorious.shape.geom.Polygon(transformedPoints),
            false, shape.style
        );
    } else if (shape.type == annotorious.shape.ShapeType.OVAL) {
        var geom = shape.geometry;
        var transformed = transformationFn(geom);
        return new annotorious.shape.Shape(annotorious.shape.ShapeType.OVAL, transformed, false, shape.style);
    }

    return undefined;
}

/**
 * Computes a 'hashCode' for the specified shape. Not the nicest (and most performat?)
 * way to do it. But we need a useful .toString kind-of functionality to use for hash table
 * keys in the viewer!
 * @param {annotorious.shape.Shape} shape the shape
 * @return {string} a 'hashcode' for the shape
 */
annotorious.shape.hashCode = function(shape) {
  // return JSON.stringify(shape["geometry"]);
  if (!shape.uuid){
    shape.uuid = nanoid();
  }
  return shape.uuid;
}
