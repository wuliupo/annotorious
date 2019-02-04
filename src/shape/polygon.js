goog.provide('annotorious.shape.geom.Polygon');

goog.require('annotorious.shape.geom.Point');

/**
 * A polygon.
 * @param {Array.<annotorious.shape.geom.Point>} points the points
 * @constructor
 */
annotorious.shape.geom.Polygon = function(points) {
  this.points = points;
}


/** Polygon-specific helper functions & geometry computation utilities **/


/**
 * Computes the area of a polygon. Note that the area can be <0, depending on the
 * clockwise/counterclockwise orientation of the polygon vertices!
 * @param {Array.<annotorious.shape.geom.Point>} points the points
 * @return {number} the area
 */
annotorious.shape.geom.Polygon.computeArea = function(points) {
    var area = 0.0;

    var j = points.length - 1;
    for (var i=0; i<points.length; i++) {
      area += (points[j].x + points[i].x) * (points[j].y -points[i].y); 
      j = i; 
    }

    return area / 2;  
}

/**
 * Tests if a polygon is oriented clockwise or counterclockwise.
 * @param {Array.<annotorious.shape.geom.Point>} points the points
 * @return {boolean} true if the geometry is in clockwise orientation
 */
annotorious.shape.geom.Polygon.isClockwise = function(points) {
  return annotorious.shape.geom.Polygon.computeArea(points) < 0;
}

/**
 * Computes the centroid coordinate of a polygon.
 * @param {Array.<annotorious.shape.geom.Point>} points the points
 * @returns {annotorious.shape.geom.Point} the centroid X/Y coordinate
 */
annotorious.shape.geom.Polygon.computeCentroid = function(points) {
  var x = 0;
  var y = 0;
  var f;
  var j = points.length - 1;

  for (var i=0; i<points.length; i++) {
    f = points[i].x * points[j].y - points[j].x * points[i].y;
    x += (points[i].x + points[j].x) * f;
    y += (points[i].y + points[j].y) * f;
    j = i;
  }

  f = annotorious.shape.geom.Polygon.computeArea(points) * 6;
  return new annotorious.shape.geom.Point(Math.abs(x/f), Math.abs(y/f)); 
}

/**
 * A simple triangle expansion algorithm that shifts triangle vertices in/outwards by a specified
 * delta, along the axis centroid->vertex. Used internally as a subroutine for polygon expansion.
 * @param {Array.<annotorious.shape.geom.Point>} points the points
 * @return {Array.<annotorious.shape.geom.Point>} the expanded triangle
 * @private
 */
annotorious.shape.geom.Polygon._expandTriangle = function(points, delta) {
  function signum(number) {
    return number > 0 ? 1 : number < 0 ? -1 : 0;
  }

  function shiftAlongAxis(px, centroid, delta) {
    var axis = { x: (px.x - centroid.x) , y: (px.y - centroid.y) };
    var sign_delta = signum(delta);
    var sign_x = signum(axis.x) * sign_delta;
    var sign_y = signum(axis.y) * sign_delta;
  
    var dy = Math.sqrt(Math.pow(delta, 2) / (1 + Math.pow((axis.x / axis.y), 2)));
    var dx = (axis.x / axis.y) * dy;
    return { x: px.x + Math.abs(dx) * sign_x, y: px.y + Math.abs(dy) * sign_y };
  }
  
  var centroid = annotorious.shape.geom.Polygon.computeCentroid(points);
  var expanded = [];
    
  for (var i=0; i<points.length; i++) {
    var sign = (annotorious.shape.geom.Polygon.isClockwise(points)) ? -1 : 1;
    expanded.push(shiftAlongAxis(points[i], centroid, sign * delta));
  }
    
  return expanded;
}

/**
 * A simple polygon expansion algorithm that generates a series of triangles from 
 * the polygon, and then subsequently applies the _expandTriangle method.
 * @param {Array.<annotorious.shape.geom.Point>} points the points
 * @param {number} delta the distance by which to expand
 * @return {Array.<annotorious.shape.geom.Point>} the expanded polygon
 */
annotorious.shape.geom.Polygon.expandPolygon = function(points, delta) {
  var sign = (annotorious.shape.geom.Polygon.isClockwise(points)) ? -1 : 1;
  
  if (points.length < 4)
    return annotorious.shape.geom.Polygon._expandTriangle(points, sign * delta);
  
  var prev = points.length - 1;
  var next = 1;
  
  var expanded = [];
  for (var current = 0; current<points.length; current++) {
    var expTriangle = annotorious.shape.geom.Polygon._expandTriangle([ points[prev], points[current], points[next] ], sign * delta);
    expanded.push(expTriangle[1]);
    prev = current;
    next++;
    if (next > points.length - 1)
      next = 0;
  }
  
  return expanded;
}
