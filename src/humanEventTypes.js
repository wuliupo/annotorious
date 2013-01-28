(function(window, body, goog, undefined) {
  var hasTouch;

  goog.provide('annotorious.humanEvents');
  goog.require('goog.events.EventType');
  
  hasTouch = 'ontouchstart' in window;
  
  annotorious.humanEvents = {
    DOWN: (hasTouch) ? goog.events.EventType.TOUCHSTART : goog.events.EventType.MOUSEDOWN,
    OVER: (hasTouch) ? goog.events.EventType.TOUCHSTART : goog.events.EventType.MOUSEOVER,
    MOVE: (hasTouch) ? goog.events.EventType.TOUCHMOVE : goog.events.EventType.MOUSEMOVE,
    UP: (hasTouch) ? goog.events.EventType.TOUCHEND : goog.events.EventType.MOUSEUP,
    OUT: (hasTouch) ? goog.events.EventType.TOUCHEND : goog.events.EventType.MOUSEOUT,
    CLICK: (hasTouch) ? goog.events.EventType.TOUCHEND : goog.events.EventType.CLICK
  };  
  
})(window, document.body, goog);