goog.provide('annotorious.Editor');

goog.require('goog.dom');
goog.require('goog.dom.query');
goog.require('goog.soy');
goog.require('goog.string.html.htmlSanitize');
goog.require('goog.style');
goog.require('goog.ui.Textarea');

goog.require('annotorious.templates');

/**
 * Annotation edit form.
 * @param {Object} annotator reference to the annotator
 * @constructor
 */
annotorious.Editor = function (annotator) {
    this.element = goog.soy.renderAsElement(annotorious.templates.editform);

    /** @private **/
    this._annotator = annotator;

    /** @private **/
    this._item = annotator.getItem();

    /** @private **/
    this._original_annotation;

    /** @private **/
    this._current_annotation;

    /** @private **/
    this._textarea = new goog.ui.Textarea('');

    /** @private **/
    this._btnCancel = goog.dom.query('.annotorious-editor-button-cancel', this.element)[0];

    /** @private **/
    this._btnSave = goog.dom.query('.annotorious-editor-button-save', this.element)[0];

    /** @private **/
    this._btnContainer = goog.dom.getParentElement(this._btnSave);

    /** @private **/
    this._extraFields = [];

    /** @private **/
    this._typeSelectorContainer = goog.dom.query('.annotorious-type-selector-container', this.element)[0];

    /** @private **/
    this._typeSelectors;

    /** @private **/
    this._type;

    var self = this;
    goog.events.listen(this._btnCancel, goog.events.EventType.CLICK, function (event) {
        event.preventDefault();
        annotator.stopSelection(self._original_annotation);
        self.close();
    });

    goog.events.listen(this._btnSave, goog.events.EventType.CLICK, function (event) {
        event.preventDefault();
        var annotation = self.getAnnotation();
        annotator.addAnnotation(annotation);
        annotator.stopSelection();

        if (self._original_annotation)
            annotator.fireEvent(annotorious.events.EventType.ANNOTATION_UPDATED, annotation, annotator.getItem());
        else
            annotator.fireEvent(annotorious.events.EventType.ANNOTATION_CREATED, annotation, annotator.getItem());
        self.close();
    });

    goog.style.setElementShown(this.element, false);
    goog.dom.appendChild(annotator.element, this.element);
    this._textarea.decorate(goog.dom.query('.annotorious-editor-text', this.element)[0]);
    annotorious.dom.makeHResizable(this.element, function () {
        self._textarea.resize();
    });
}

/**
 * Adds a field to the editor GUI widget. A field can be either an (HTML) string, or
 * a function that takes an Annotation as argument and returns an (HTML) string or
 * a DOM element.
 * @param {string | Function} field the field
 */
annotorious.Editor.prototype.addField = function (field) {
    var fieldEl = goog.dom.createDom('div', 'annotorious-editor-field');

    if (goog.isString(field)) {
        fieldEl.innerHTML = field;
    } else if (goog.isFunction(field)) {
        this._extraFields.push({el: fieldEl, fn: field});
    } else if (goog.dom.isElement(field)) {
        goog.dom.appendChild(fieldEl, field);
    }

    goog.dom.insertSiblingBefore(fieldEl, this._btnContainer);
}

/**
 * Opens the edit form with an annotation.
 * @param {annotorious.Annotation=} opt_annotation the annotation to edit (or undefined)
 * @param {Object=} opt_event the event, if any
 */
annotorious.Editor.prototype.open = function (opt_annotation) {
    console.log("Editor openning...");
    /** @private **/
    this._annotator.fireEvent(annotorious.events.EventType.BEFORE_EDITOR_SHOWN, opt_annotation);

    this._original_annotation = opt_annotation;
    this._current_annotation = opt_annotation;

    if (this._annotator.typeSelectors) {
        this._typeSelectors = this._annotator.typeSelectors;
        var selectors = goog.soy.renderAsFragment(annotorious.templates.typeSelectors, {
            selectors: this._typeSelectors
        });
        goog.dom.removeChildren(this._typeSelectorContainer);
        goog.dom.appendChild(this._typeSelectorContainer, selectors);
        var selector_buttons = goog.dom.query('.annotorious-type-selector', this._typeSelectorContainer);
        var self = this;
        var hasDefault = false;
        goog.array.forEach(selector_buttons, function (selector_button) {
            if (opt_annotation && selector_button.name === opt_annotation.type) {
                goog.dom.classes.addRemove(selector_button, 'annotorious-type-selector-normal', 'annotorious-type-selector-focus');
                hasDefault = true;
            }
            goog.events.listen(selector_button, goog.events.EventType.CLICK, function (event) {
                event.preventDefault();
                goog.array.forEach(selector_buttons, function (button) {
                    goog.dom.classes.addRemove(button, 'annotorious-type-selector-focus', 'annotorious-type-selector-normal');
                });
                goog.dom.classes.addRemove(this, 'annotorious-type-selector-normal', 'annotorious-type-selector-focus');
                self._type = this.name;
            });
        });
        if (!hasDefault) {
            var button = goog.dom.query('.annotorious-type-selector', this._typeSelectorContainer)[0];
            button.click();
        }
    }

    if (opt_annotation)
        this._textarea.setValue(opt_annotation.text);

    goog.style.setElementShown(this.element, true);
    this._textarea.getElement().focus();

    // Update extra fields (if any)
    goog.array.forEach(this._extraFields, function (field) {
        var f = field.fn(opt_annotation);
        if (goog.isString(f)) {
            field.el.innerHTML = f;
        } else if (goog.dom.isElement(f)) {
            goog.dom.removeChildren(field.el);
            goog.dom.appendChild(field.el, f);
        }
    });
    this._annotator.fireEvent(annotorious.events.EventType.EDITOR_SHOWN, opt_annotation);
}

/**
 * Closes the editor.
 */
annotorious.Editor.prototype.close = function () {
    goog.style.setElementShown(this.element, false);
    this._textarea.setValue('');
}

/**
 * Sets the position (i.e. CSS left/top value) of the editor element.
 * @param {annotorious.shape.geom.Point} xy the viewport coordinate
 */
annotorious.Editor.prototype.setPosition = function (xy) {
    goog.style.setPosition(this.element, xy.x, xy.y);
}

/**
 * Returns the annotation that is the current state of the editor.
 * @return {annotorious.Annotation} the annotation
 */
annotorious.Editor.prototype.getAnnotation = function () {
    var sanitized = goog.string.html.htmlSanitize(this._textarea.getValue(), function (url) {
        return url;
    });
    if (this._current_annotation) {
        this._current_annotation.text = sanitized;
        this._current_annotation.type = this._type;
    } else {
        this._current_annotation =
            new annotorious.Annotation(this._item.src, sanitized, this._annotator.getActiveSelector().getShape(), this._type);
    }
    return this._current_annotation;
}

/** API exports **/
annotorious.Editor.prototype['addField'] = annotorious.Editor.prototype.addField;
annotorious.Editor.prototype['getAnnotation'] = annotorious.Editor.prototype.getAnnotation;
