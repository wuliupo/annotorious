goog.provide('annotorious.mediatypes.Annotator');

/**
 * A base class for Annotorious Annotator implementations.
 * @constructor
 */
annotorious.mediatypes.Annotator = function() { }

annotorious.mediatypes.Annotator.prototype.addAnnotation = function(annotation, opt_replace) {
  this._viewer.addAnnotation(annotation, opt_replace);
}

annotorious.mediatypes.Annotator.prototype.addHandler = function(type, handler) {
  this._eventBroker.addHandler(type, handler);  
}

annotorious.mediatypes.Annotator.prototype.fireEvent = function(type, event, opt_extra) {
  return this._eventBroker.fireEvent(type, event, opt_extra);
}

annotorious.mediatypes.Annotator.prototype.getActiveSelector = function() {
  return this._currentSelector;
}

annotorious.mediatypes.Annotator.prototype.highlightAnnotation = function(annotation) {
  this._viewer.highlightAnnotation(annotation);
}

annotorious.mediatypes.Annotator.prototype.removeAnnotation = function(annotation) {
  this._viewer.removeAnnotation(annotation);
}

annotorious.mediatypes.Annotator.prototype.removeHandler = function(type, handler) {
  this._eventBroker.removeHandler(type, handler);
}

annotorious.mediatypes.Annotator.prototype.stopSelection = function(original_annotation) {
  if (annotorious.events.ui.hasMouse)
    goog.style.showElement(this._editCanvas, false);
    
  if (this._stop_selection_callback) {
    this._stop_selection_callback();
    delete this._stop_selection_callback;
  }

  this._currentSelector.stopSelection();
   
  // If this was an edit of an annotation (rather than creation of a new one) re-add to viewer!
  if (original_annotation)
    this._viewer.addAnnotation(original_annotation);
}

annotorious.mediatypes.Annotator.prototype._attachListener = function(activeCanvas) {
  var self = this;

  //timer for long click detection on mobile
  self.clickTimer = null;

  //long click detection (resets when up, stop the timeout)
  goog.events.listen(activeCanvas, annotorious.events.ui.EventType.UP, function(event) {
      clearTimeout(this.clickTimer);
  });

  goog.events.listen(activeCanvas, annotorious.events.ui.EventType.DOWN, function(event) {

    var coords = annotorious.events.ui.sanitizeCoordinates(event, activeCanvas);
    self._viewer.highlightAnnotation(false);
    var annotations = self._viewer.getAnnotationsAt(coords.x, coords.y);

        if (self._selectionEnabled && annotations.length === 0) {
            goog.style.showElement(self._editCanvas, true);
            self._currentSelector.startSelection(coords.x, coords.y);
        } else {
            var annotations = self._viewer.getAnnotationsAt(coords.x, coords.y);
            if (annotations.length > 0) {
                self._viewer.highlightAnnotation(annotations[0]);
            }
        }
        if (!annotorious.events.ui.hasMouse) {
          if (goog.dom.classes.get(self._viewer._canvas).indexOf('annotorious-item-focus') == -1) {
            goog.dom.classes.addRemove(self._viewer._canvas, 'annotorious-item-unfocus', 'annotorious-item-focus');
          }
          else {
            if (annotations.length == 0) {
              goog.dom.classes.addRemove(self._viewer._canvas, 'annotorious-item-focus', 'annotorious-item-unfocus');
            }
          }
        }
        if (annotations.length !== 0) {
            // fire long click if down for 200 milli secondsw
            if (!annotorious.events.ui.hasMouse) {
                this.clickTimer = setTimeout(function() {
                    self._viewer._annotator._eventBroker.fireEvent(annotorious.events.EventType.ANNOTATION_CLICKED_LONG, annotations[0]);
                }, 200);
            }
        }
	});
}
