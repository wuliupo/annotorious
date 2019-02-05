goog.provide('annotorious.mediatypes.image.Viewer');


var humanEvents;

goog.provide('annotorious.modules.image.Viewer');

goog.require('goog.soy');
goog.require('goog.events');
goog.require('goog.dom.classes');
goog.require('goog.dom.query');

humanEvents = annotorious.humanEvents;
goog.require('annotorious.events');
goog.require('annotorious.shape.geom.Point');

/**
 * The image viewer - the central entity that manages annotations
 * displayed for one image.
 * @param {Element} canvas the canvas element
 * @param {annotorious.mediatypes.image.ImageAnnotator} annotator reference to the annotator
 * @constructor
 */
annotorious.mediatypes.image.Viewer = function(canvas, annotator) {
    /** @private **/
    this._canvas = canvas;

    /** @private **/
    this._annotator = annotator;

    /** @private **/
    this._annotations = [];

    /** @private **/
    this._shapes = [];

    /** @private **/
    this._g2d = this._canvas.getContext('2d');

    /** @private **/
    this._currentAnnotation;

    /** @private **/
    this._eventsEnabled = true;

    /** @private **/
    this._cachedMouseEvent;

    /** @private **/
    this._keepHighlighted = false;

    var self = this;
    goog.events.listen(this._canvas, annotorious.events.ui.EventType.MOVE, function(event) {
        if (self._eventsEnabled) {
            self._onMouseMove(event);
        } else {
            self._cachedMouseEvent = event;
        }
    });

    goog.events.listen(this._canvas, annotorious.events.ui.EventType.CLICK, function(event) {
        if (self._currentAnnotation !== undefined && self._currentAnnotation != false) {
            self._annotator.fireEvent(annotorious.events.EventType.ANNOTATION_CLICKED, self._currentAnnotation);
        } else {
            if (!self._annotator.selectionEnabled()) {
                self._annotator.fireEvent(annotorious.events.EventType.NON_ANNOTATION_NON_EDITABLE_CLICKED, self._annotator);
            }
        }
    });

    annotator.addHandler(annotorious.events.EventType.MOUSE_OUT_OF_ANNOTATABLE_ITEM, function(event) {
        delete self._currentAnnotation;
        self._eventsEnabled = true;
    });

    annotator.addHandler(annotorious.events.EventType.BEFORE_POPUP_HIDE, function() {
        if (!self._eventsEnabled && self._cachedMouseEvent) {
            var mouseX = self._cachedMouseEvent.offsetX;
            var mouseY = self._cachedMouseEvent.offsetY;

            var previousAnnotation = self._currentAnnotation;
            self._currentAnnotation = self.topAnnotationAt(mouseX, mouseY);

            self._eventsEnabled = true;

            if (previousAnnotation != self._currentAnnotation) {
                // Annotation under mouse has changed in the mean time - redraw
                self.redraw();
                self._annotator.fireEvent(annotorious.events.EventType.MOUSE_OUT_OF_ANNOTATION, {
                    annotation: previousAnnotation,
                    mouseEvent: self._cachedMouseEvent
                });

                self._annotator.fireEvent(annotorious.events.EventType.MOUSE_OVER_ANNOTATION, {
                    annotation: self._currentAnnotation,
                    mouseEvent: self._cachedMouseEvent
                });
            } else {
                if (self._currentAnnotation) {
                    // Annotation under mouse is the same - just keep showing the popup
                    self._annotator.popup.clearHideTimer();
                }
            }
        } else {
            // Popup is hiding and mouse events are enabled? Must be because
            // the mouse is outside the annotatable media! Redraw.
            self.redraw();
        }
    });
}

/**
 * Adds an annotation to the viewer.
 * @param {annotorious.Annotation} annotation the annotation
 * @param {annotorious.Annotation=} opt_replace optionally, an existing annotation to replace
 */
annotorious.mediatypes.image.Viewer.prototype.addAnnotation = function(annotation, opt_replace) {
    // Remove opt_replace, if specified
    if (opt_replace) {
        if (opt_replace == this._currentAnnotation)
            delete this._currentAnnotation;

        goog.array.remove(this._annotations, opt_replace);
        delete this._shapes[annotorious.shape.hashCode(opt_replace.shapes[0])];
    }

    this._annotations.push(annotation);

    // The viewer always operates in pixel coordinates for efficiency reasons
    var shape = annotation.shapes[0];
    if (shape.units == annotorious.shape.Units.PIXEL) {
        this._shapes[annotorious.shape.hashCode(annotation.shapes[0])] = shape;
    } else {
        var self = this;
        var viewportShape = annotorious.shape.transform(shape, function(xy) {
            return self._annotator.fromItemCoordinates(xy);
        });
        this._shapes[annotorious.shape.hashCode(annotation.shapes[0])] = viewportShape;
    }

    this.redraw();
}

/**
 * Removes an annotation from the viewer.
 * @param {annotorious.Annotation} annotation the annotation
 */
annotorious.mediatypes.image.Viewer.prototype.removeAnnotation = function(annotation) {
    if (annotation == this._currentAnnotation)
        delete this._currentAnnotation;

    goog.array.remove(this._annotations, annotation);
    delete this._shapes[annotorious.shape.hashCode(annotation.shapes[0])];
    this.redraw();
}


/**
 * Returns all annotations in this viewer.
 * @return {Array.<annotorious.Annotation>} the annotations
 */
annotorious.mediatypes.image.Viewer.prototype.getAnnotations = function() {
    return goog.array.clone(this._annotations);
}

annotorious.mediatypes.image.Viewer.prototype.getAnnotationsAsDOM = function() {
    var result = [];
    goog.array.forEach(this._annotations, function(annotation) {
        var shape = annotation.shapes[0].geometry;
        var annotationDOM = document.createElement("section");
        annotationDOM.className = 'annotText';
        annotationDOM.style.borderWidth = '1px';
        annotationDOM.style.width = (shape.width * 100).toString() + '%';
        annotationDOM.style.height = (shape.height * 100).toString() + '%';
        annotationDOM.style.top = (shape.y * 100).toString() + '%';
        annotationDOM.style.left = (shape.x * 100).toString() + '%';
        annotationDOM.style.position = 'absolute';
        goog.array.extend(result, annotationDOM);
    });
    //console.log(result);
    return result;
}
annotorious.modules.image.Viewer.prototype.getAnnotations = function() {
  return this._annotations;
};

/**
 * Highlights a particular annotation in the viewer, or de-highlights (if that's a
 * word...) all, if no annotation is passed to the method.
 * @param {annotorious.Annotation | undefined} opt_annotation the annotation
 */
annotorious.mediatypes.image.Viewer.prototype.highlightAnnotation = function(opt_annotation) {
    this._currentAnnotation = opt_annotation;
    if (opt_annotation)
        this._keepHighlighted = true;
    else
        this._annotator.popup.startHideTimer();
    this.redraw();
    this._eventsEnabled = true;
}

/**
 * Returns the currently highlighted annotation (or 'undefined' if none).
 * @returns {Object} the currently highlighted annotation
 */
annotorious.mediatypes.image.Viewer.prototype.getHighlightedAnnotation = function() {
    return this._currentAnnotation;
}

/**
 * Convenience method returning only the top-most annotation at the specified coordinates.
 * @param {number} px the X coordinate
 * @param {number} py the Y coordinates
 */
annotorious.mediatypes.image.Viewer.prototype.topAnnotationAt = function(px, py) {
    var annotations = this.getAnnotationsAt(px, py);
    if (annotations.length > 0) {
        return annotations[0];
    } else {
        return undefined;
    }
}

/**
 * Returns the annotations at the specified X/Y coordinates.
 * @param {number} px the X coordinate
 * @param {number} py the Y coordinate
 * @return {Array.<annotorious.Annotation>} the annotations sorted by size, smallest first
 */
annotorious.mediatypes.image.Viewer.prototype.getAnnotationsAt = function(px, py) {
    // TODO for large numbers of annotations, we can optimize this
    // using a tree- or grid-like data structure instead of a list
    var intersectedAnnotations = [];

    var self = this;
    goog.array.forEach(this._annotations, function(annotation) {
        if (annotorious.shape.intersects(self._shapes[annotorious.shape.hashCode(annotation.shapes[0])], px, py)) {
            intersectedAnnotations.push(annotation);
        }
    });

    goog.array.sort(intersectedAnnotations, function(a, b) {
        var shape_a = self._shapes[annotorious.shape.hashCode(a.shapes[0])];
        var shape_b = self._shapes[annotorious.shape.hashCode(b.shapes[0])];
        return annotorious.shape.getSize(shape_a) - annotorious.shape.getSize(shape_b);
    });

    return intersectedAnnotations;
}

/**
 * @private
 */
annotorious.mediatypes.image.Viewer.prototype._onMouseMove = function(event) {
    var topAnnotation = this.topAnnotationAt(event.offsetX, event.offsetY);
    // TODO remove code duplication
    var self = this;
    if (topAnnotation) {
        this._keepHighlighted = this._keepHighlighted && (topAnnotation == this._currentAnnotation);

        if (!this._currentAnnotation) {
            // Mouse moved into annotation from empty space - highlight immediately
            this._currentAnnotation = topAnnotation;
            this.redraw();
            this._annotator.fireEvent(annotorious.events.EventType.MOUSE_OVER_ANNOTATION, {
                'annotation': self._currentAnnotation,
                mouseEvent: event
            });
        } else if (this._currentAnnotation != topAnnotation) {
            // Mouse changed from one annotation to another one
            this._eventsEnabled = false;
            this._annotator.popup.startHideTimer();
        }
    } else if (!this._keepHighlighted) {
        if (this._currentAnnotation) {
            // Mouse moved out of an annotation, into empty space
            this._eventsEnabled = false;
            this._annotator.popup.startHideTimer();
        }
    }
}

/**
 * @param {annotorious.shape.Shape} shape the shape
 * @param {boolean=} highlight set true to highlight the shape
 * @private
 */
annotorious.mediatypes.image.Viewer.prototype._draw = function(shape, highlight) {
    var selector = goog.array.find(this._annotator.getAvailableSelectors(), function(selector) {
        return selector.getSupportedShapeType() == shape.type;
    });

    if (selector)
        selector.drawShape(this._g2d, shape, highlight);
    else
        console.log('WARNING unsupported shape type: ' + shape.type);
}

/**
 * @private
 */
annotorious.mediatypes.image.Viewer.prototype.redraw = function() {
    this._g2d.clearRect(0, 0, this._canvas.width, this._canvas.height);

    var self = this;
    goog.array.forEach(this._annotations, function(annotation) {
        if (annotation != self._currentAnnotation)
            self._draw(self._shapes[annotorious.shape.hashCode(annotation.shapes[0])]);
    });

    if (this._currentAnnotation) {
        var shape = this._shapes[annotorious.shape.hashCode(this._currentAnnotation.shapes[0])];
        this._draw(shape, true);
        var bbox = annotorious.shape.getBoundingRect(shape).geometry;
        this._annotator.popup.show(this._currentAnnotation, new annotorious.shape.geom.Point(bbox.x, bbox.y + bbox.height + 5));

        // TODO Orientation check - what if the popup would be outside the viewport?
    }
}


//Helper function for redrawGlow. Takes care of animation.

annotorious.mediatypes.image.Viewer.prototype.glow = function(shapes, time) {
    g2d = this._g2d;
    var self = this;

    var selector = goog.array.find(this._annotator.getAvailableSelectors(), function(selector) {
        return selector.getSupportedShapeType() == shapes[0].type;
    });

    var properties = selector.getProperties();

    var blur = 0,
        opacity = 0,
        is_blur_inc = true;

    var continueAnimating = true;
    //set the focus during glow
    goog.dom.classes.addRemove(self._canvas, 'annotorious-item-unglow', 'annotorious-item-glow');
    setTimeout(function() {
        continueAnimating = false;
        self.redraw();
        goog.dom.classes.addRemove(self._canvas, 'annotorious-item-glow', 'annotorious-item-unglow');
        // if(started outside annotatable item){
        //     goog.dom.classes.addRemove(self._canvas, 'annotorious-item-focus', 'annotorious-item-unfocus');
        // }
    }, time);

    function convertHex(hex, opacity) {
            hex = hex.replace('#', '');
            r = parseInt(hex.substring(0, 2), 16);
            g = parseInt(hex.substring(2, 4), 16);
            b = parseInt(hex.substring(4, 6), 16);

            result = [r, g, b];
            return result;
        }
        //colour that will glow
    colour_in_rgb = convertHex(properties['hi_fill']);

    //curently draws three things
    //1) a black border
    //2) a white stroke that has opacity = 1
    //3) a stroke with a colour defined above, that will oscillate in opacity
    function animate() {
        if (continueAnimating) {
            g2d.clearRect(0, 0, self._canvas.width, self._canvas.height);

            for (var i = shapes.length - 1; i >= 0; i--) {
                geom = shapes[i].geometry;

                g2d.beginPath();

                // //Border doesn't change
                // g2d.lineJoin = "round";
                // g2d.lineWidth = properties['outline_width'];
                // g2d.strokeStyle = properties['outline'];
                // g2d.strokeRect(
                //     geom.x + properties['outline_width'] / 2,
                //     geom.y + properties['outline_width'] / 2,
                //     geom.width - properties['outline_width'],
                //     geom.height - properties['outline_width']
                // );

                //White stroke
                g2d.lineJoin = "miter";
                g2d.lineWidth = properties['stroke_width'];
                g2d.strokeStyle = 'rgb(255,255,255)';
                g2d.strokeRect(
                    geom.x + properties['outline_width'] + properties['stroke_width'] / 2,
                    geom.y + properties['outline_width'] + properties['stroke_width'] / 2,
                    geom.width - properties['outline_width'] * 2 - properties['stroke_width'],
                    geom.height - properties['outline_width'] * 2 - properties['stroke_width']
                );

                g2d.fillStyle = 'rgba(' + colour_in_rgb[0] + ',' + colour_in_rgb[1] + ',' + colour_in_rgb[2] + ',' + opacity + ')';
                g2d.fillRect(
                    geom.x + properties['outline_width'] + properties['hi_stroke_width'] / 2,
                    geom.y + properties['outline_width'] + properties['hi_stroke_width'] / 2,
                    geom.width - properties['outline_width'] * 2 - properties['hi_stroke_width'],
                    geom.height - properties['outline_width'] * 2 - properties['hi_stroke_width']
                );

                g2d.closePath();
            };
            //size of steps to oscillate opacity by
            opacity = (is_blur_inc) ? (opacity + 0.005) : (opacity - 0.005);

            if (opacity <= 0) is_blur_inc = true;
            else if (opacity >= 0.26) is_blur_inc = false;

            requestAnimationFrame(animate);
        }
    }

    return requestAnimationFrame(animate);
}

//Set the annotations to glow for a given time.
//* @param {number=} milliseconds where annotations will glow

annotorious.mediatypes.image.Viewer.prototype.redrawGlow = function(time) {
    var self = this;
    var shapes = [];
    goog.array.forEach(this._annotations, function(annotation) {
        shapes.push(self._shapes[annotorious.shape.hashCode(annotation.shapes[0])])
    })

    if (shapes.length > 0) {
        var glowAnimation = self.glow(shapes, time);
    }

}