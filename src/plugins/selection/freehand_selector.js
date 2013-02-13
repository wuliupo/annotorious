var humanEvents = annotorious.humanEvents;
  
  
goog.provide('annotorious.selection.FreehandSelector');

goog.require('goog.events');

annotorious.selector.FreehandSelector = function(canvas, annotator) {
  // TODO get rid of paper.js dependency (shouldn't really be a problem in this case)
  paper.setup(canvas);

  var path = new paper.Path();
  path.strokeColor = '#ffffff';

  var moveListener = function(event) {
    var to = new paper.Point(event.offsetX, event.offsetY);
    path.lineTo(to);
    paper.view.draw();
  }

  goog.events.listen(canvas, humanEvents.DOWN, function(event) { 
    goog.events.listen(canvas, goog.events.humanEvents.MOVE, moveListener);
    var start = new paper.Point(event.offsetX, event.offsetY);
    path.moveTo(start);
  });

  goog.events.listen(canvas, humanEvents.UP, function(event) {
    path = new paper.Path();
    path.strokeColor = '#ffffff';
    goog.events.unlisten(canvas, humanEvents.MOVE, moveListener);
  });

}


annotorious.selector.FreehandSelector.prototype.startSelection = function(x, y) {

}

annotorious.selector.FreehandSelector.prototype.stopSelection = function() {

}
  
