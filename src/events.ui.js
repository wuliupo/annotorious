goog.provide('annotorious.events.ui');

goog.require('goog.dom');
goog.require('goog.dom.classes');
goog.require('goog.events.EventType');

if (navigator.userAgent && navigator.userAgent.indexOf('Win') > -1 && navigator.userAgent.indexOf('Chrome') > -1) {
    annotorious.events.ui.hasTouch = false; //windows 8 chrome bug when screen has a touchscreen (https://github.com/annotorious/annotorious/issues/124)
} else {
    annotorious.events.ui.hasTouch = 'ontouchstart' in window;
}

annotorious.events.ui.hasMouse = !annotorious.events.ui.hasTouch; // Just for readability

/**
 * Human interface events.
 * @enum {string}
 */
annotorious.events.ui.EventType = {

    DOWN: (annotorious.events.ui.hasTouch) ? goog.events.EventType.TOUCHSTART : goog.events.EventType.MOUSEDOWN,

    OVER: (annotorious.events.ui.hasTouch) ? "touchenter" : goog.events.EventType.MOUSEOVER,

    MOVE: (annotorious.events.ui.hasTouch) ? goog.events.EventType.TOUCHMOVE : goog.events.EventType.MOUSEMOVE,

    UP: (annotorious.events.ui.hasTouch) ? goog.events.EventType.TOUCHEND : goog.events.EventType.MOUSEUP,

    OUT: (annotorious.events.ui.hasTouch) ? "touchleave" : goog.events.EventType.MOUSEOUT,

    CLICK: (annotorious.events.ui.hasTouch) ? goog.events.EventType.TOUCHEND : goog.events.EventType.CLICK

}

/**
 * To get screen coordinates while taking into consideration mobile and the offset of the screen
 * @param {Object} event the DOM Event object
 * @param {Element} parent the parent element that triggers the event
 */
annotorious.events.ui.sanitizeCoordinates = function (event, parent) {
    var points = false;
    var offset = annotorious.dom.getOffset;

    // Dirty hack - Google Maps?
    event.offsetX = (event.offsetX) ? event.offsetX : false;
    event.offsetY = (event.offsetY) ? event.offsetY : false;

    if ((!event.offsetX || !event.offsetY) && event.event_.changedTouches) {
        points = {
            x: event.event_.changedTouches[0].clientX - offset(parent).left,
            y: event.event_.changedTouches[0].clientY - offset(parent).top
        };
    } else {
        points = {
            x: event.offsetX,
            y: event.offsetY
        };
    }
    //Add by Bain
    if (parent.hasAttribute("_scale")) {
        points.x = points.x / parent.getAttribute("_scale");
        points.y = points.y / parent.getAttribute("_scale");
    }
    return points;
};
