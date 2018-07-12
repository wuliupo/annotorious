// This file was automatically generated from image_elements.soy.
// Please don't edit this file by hand.

/**
 * @fileoverview Templates in namespace annotorious.templates.image.
 */

goog.provide('annotorious.templates.image');

goog.require('soy');
goog.require('soydata');


/**
 * @param {Object.<string, *>=} opt_data
 * @param {(null|undefined)=} opt_ignored
 * @return {string}
 * @suppress {checkTypes|uselessCode}
 */
annotorious.templates.image.canvas = function(opt_data, opt_ignored) {
  return '<canvas class="annotorious-item annotorious-opacity-fade" style="position:absolute; top:0px; left:0px; width:' + soy.$$escapeHtml(opt_data.width) + 'px; height:' + soy.$$escapeHtml(opt_data.height) + 'px; z-index:0" width="' + soy.$$escapeHtml(opt_data.width) + '" height="' + soy.$$escapeHtml(opt_data.height) + '"></canvas>';
};
if (goog.DEBUG) {
  annotorious.templates.image.canvas.soyTemplateName = 'annotorious.templates.image.canvas';
}


/**
 * @param {Object.<string, *>=} opt_data
 * @param {(null|undefined)=} opt_ignored
 * @return {string}
 * @suppress {checkTypes|uselessCode}
 */
annotorious.templates.image.hint = function(opt_data, opt_ignored) {
  return '<div class="annotorious-hint" style="white-space:nowrap; position:absolute; top:0px; left:0px; pointer-events:none;"><div class="annotorious-hint-msg annotorious-opacity-fade">' + soy.$$escapeHtml(opt_data.msg) + '</div><div class="annotorious-hint-icon" style="pointer-events:auto"></div></div>';
};
if (goog.DEBUG) {
  annotorious.templates.image.hint.soyTemplateName = 'annotorious.templates.image.hint';
}
